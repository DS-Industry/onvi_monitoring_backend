import { Injectable } from '@nestjs/common';
import { CardImportItemDto } from '../dto/receive/card-import-item.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class FileParserService {
  async parseCardImportFile(
    file: Express.Multer.File,
  ): Promise<CardImportItemDto[]> {
    try {
      console.log('File parser debug - File info:', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bufferLength: file.buffer?.length,
      });

      if (!file.buffer || file.buffer.length === 0) {
        throw new Error('File buffer is empty or missing');
      }

      const fileExtension = file.originalname
        ? file.originalname
            .toLowerCase()
            .substring(file.originalname.lastIndexOf('.'))
        : '';

      if (fileExtension === '.csv') {
        return this.parseCSVFile(file);
      } else {
        return this.parseExcelFile(file);
      }
    } catch (error) {
      console.error('File parser error:', error);
      throw new Error(`Failed to parse file: ${error.message}`);
    }
  }

  private async parseCSVFile(
    file: Express.Multer.File,
  ): Promise<CardImportItemDto[]> {
    try {
      console.log('Parsing CSV file...');

      const csvContent = file.buffer.toString('utf-8');
      const lines = csvContent.split('\n').filter((line) => line.trim());

      console.log('CSV parser debug - Content info:', {
        totalLines: lines.length,
        firstLine: lines[0],
        secondLine: lines[1],
      });

      const cards: CardImportItemDto[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = this.parseCSVLine(line);

        if (columns.length >= 2) {
          const card: CardImportItemDto = {
            devNumber: String(columns[0] || '').trim(),
            uniqueNumber: String(columns[1] || '').trim(),
          };

          if (card.devNumber && card.uniqueNumber) {
            cards.push(card);
          } else {
            console.warn('Skipping invalid CSV row:', {
              line,
              card,
              rowIndex: i,
            });
          }
        } else {
          console.warn('Skipping CSV row with insufficient columns:', {
            line,
            rowIndex: i,
          });
        }
      }

      console.log('CSV parser debug - Processed cards:', {
        totalCards: cards.length,
        cards: cards.slice(0, 3),
      });

      return cards;
    } catch (error) {
      console.error('CSV parser error:', error);
      throw new Error(`Failed to parse CSV file: ${error.message}`);
    }
  }

  private async parseExcelFile(
    file: Express.Multer.File,
  ): Promise<CardImportItemDto[]> {
    try {
      console.log('Parsing Excel file...');

      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];

      if (!sheetName) {
        throw new Error('No sheets found in Excel file');
      }

      const worksheet = workbook.Sheets[sheetName];

      if (!worksheet) {
        throw new Error(`Sheet '${sheetName}' not found in Excel file`);
      }

      console.log('Excel parser debug - Workbook info:', {
        sheetNames: workbook.SheetNames,
        sheetName: sheetName,
        hasWorksheet: !!worksheet,
      });

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      console.log('Excel parser debug - Parsed data:', {
        totalRows: jsonData.length,
        firstRow: jsonData[0],
        secondRow: jsonData[1],
      });

      const cards: CardImportItemDto[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i] as any[];

        if (row.length >= 2) {
          const card: CardImportItemDto = {
            devNumber: String(row[0] || '').trim(),
            uniqueNumber: String(row[1] || '').trim(),
          };

          if (card.devNumber && card.uniqueNumber) {
            cards.push(card);
          } else {
            console.warn('Skipping invalid Excel row:', {
              row,
              card,
              rowIndex: i,
            });
          }
        } else {
          console.warn('Skipping Excel row with insufficient columns:', {
            row,
            rowIndex: i,
          });
        }
      }

      console.log('Excel parser debug - Processed cards:', {
        totalCards: cards.length,
        cards: cards.slice(0, 3),
      });

      return cards;
    } catch (error) {
      console.error('Excel parser error:', error);
      throw new Error(`Failed to parse Excel file: ${error.message}`);
    }
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());

    return result;
  }
}
