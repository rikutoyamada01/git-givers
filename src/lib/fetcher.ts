export class HttpError extends Error {
  status: number;
  info: unknown;

  constructor(message: string, status: number, info: unknown) {
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
