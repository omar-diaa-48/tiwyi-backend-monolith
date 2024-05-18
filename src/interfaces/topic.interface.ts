export interface ITopic<P, R> {
  name: string;
  PayloadType?: P;
  ResponseType?: R;
}

export type PayloadType = 'PayloadType';
export type ResponseType = 'ResponseType';
