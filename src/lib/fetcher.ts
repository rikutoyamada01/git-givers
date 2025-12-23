export class HttpError extends Error {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, status: number, info: any) {
    super(message);
    this.status = status;
    this.info = info;
  }
}

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    const errorInfo = await res.json().catch(() => ({}));
    throw new HttpError(
      'An error occurred while fetching the data.',
      res.status,
      errorInfo
    );
  }

  return res.json();
};
