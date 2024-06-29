const getYoutubeVideoId = (url: string) => {
  const urlObj = new URL(url);
  if (urlObj.hostname === 'youtu.be') {
    return urlObj.pathname.slice(1);
  } else if (urlObj.hostname.includes('youtube.com')) {
    return urlObj.searchParams.get('v');
  }
  return null;
};

export default getYoutubeVideoId;
