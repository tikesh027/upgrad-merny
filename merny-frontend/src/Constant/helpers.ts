import Cookies from 'universal-cookie';

const cookies = new Cookies();

export function formatDateToRelative(dateString: string): string {
  const date: Date = new Date(dateString);
  const now: Date = new Date();
  const diffInSeconds: number = Math.floor(
    (now.getTime() - date.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return diffInSeconds + " seconds ago";
  }

  const diffInMinutes: number = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes + " minutes ago";
  }

  const diffInHours: number = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours + " hours ago";
  }

  const diffInDays: number = Math.floor(diffInHours / 24);
  return diffInDays + " days ago";
}


export function parseJWT(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  // if (Buffer) {
  //   return JSON.parse(Buffer.from(base64, 'base64').toString('utf8'));
  // }
  return JSON.parse(atob(base64));
}

export function getAccessTokenFromCookie(){
  const accessToken = cookies.get('user-access-token');
  return accessToken;
}

export function removeAccessTokenCookie(){
  cookies.remove('user-access-token');
}