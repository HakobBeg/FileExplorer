export interface File {
  path: string[];
  modificationDate: Date;
  type: string;
  size?: number;
  fileContent?: string;
}
