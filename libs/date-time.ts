export function secondToMinute(seconds: number) {
  // if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
  //   throw new RangeError('This stream is transcoding to the correct file type, please wait. Use MP4 files for optimal upload experience in future.');
  // }
  if (seconds < 3600) {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  }
  return new Date(seconds * 1000).toISOString().substring(11, 19);
}

export function formatToUsDate(date: string) {
  return Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "2-digit" }).format(
    new Date(date)
  );
}
