export interface IDatabaseConfig {
  uri: string;
  name: string;
}

export class DatabaseConfig implements IDatabaseConfig {
  public uri: string;
  public name: string;

  constructor(uri: string, name: string) {
    this.name = name;
    this.uri = uri;
  }
}
