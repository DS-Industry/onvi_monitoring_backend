export abstract class IFileAdapter {
  abstract upload(file: Express.Multer.File, key: string): Promise<string>;
  abstract download(key: string): Promise<any>;
  abstract delete(key: string): Promise<void>;
}
