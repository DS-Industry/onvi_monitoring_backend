export abstract class BaseEntity<Props> {
  protected props: Props;

  protected constructor(props: Props) {
    this.props = props;
  }
}
