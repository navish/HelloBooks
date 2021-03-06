import URLPackage from 'url';
import noCover from '../assets/images/no-cover.jpg';

export const showCoverPhoto =
    coverPhoto =>
      coverPhoto || noCover;

export const isValidUrl = (str) => {
  const urlRegex =
          '^(?:(?:http|https)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
  const url = new RegExp(urlRegex, 'i');
  return str.length < 2083 && url.test(str);
};

export const parseCloudinaryURL = (url) => {
  let newUrl = {};
  newUrl.public_id = '';
  if (url && isValidUrl(url)) {
    newUrl = URLPackage.parse(url);
    const urlPath = newUrl.path.match(/.*\/(.*)\.+/);
    newUrl.public_id = urlPath ? urlPath[1] : '';
    return newUrl;
  }
  return newUrl;
};

export const isImage = (type) => {
  if (/^image/.test(type)) {
    return true;
  }
  return false;
};

export const isPDF = (type) => {
  if (/^application\/pdf/.test(type)) {
    return true;
  }
  return false;
};

export const extractURLQuery = (url) => new URL(url).searchParams;
