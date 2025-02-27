import { v4 as uuidv4 } from 'uuid';
import he from 'he';

import { extractParenthesis } from '../utils/re';
import { reExtractSongName } from '@stores/appStore';

export const DEFAULT_NULL_URL = 'NULL';
export const NULL_TRACK = { url: DEFAULT_NULL_URL, urlRefreshTimeStamp: 0 };

interface SongProps {
  cid: string | number;
  bvid: string;
  name: string;
  nameRaw?: string;
  singer: string;
  singerId: string | number;
  cover: string;
  highresCover?: string;
  lyric?: string;
  lyricOffset?: number;
  page?: number;
  biliShazamedName?: string;
  duration?: number;
  album?: string;
  addedDate?: number;
  source?: string;
  isLive?: boolean;
  liveStatus?: boolean;
  metadataOnLoad?: boolean;
}

export default ({
  cid,
  bvid,
  name,
  singer,
  cover,
  singerId,
  lyric,
  lyricOffset,
  page,
  biliShazamedName,
  duration = 0,
  album,
  addedDate,
  source,
  isLive,
  liveStatus,
  metadataOnLoad,
}: SongProps): NoxMedia.Song => {
  return {
    id: String(cid),
    bvid,
    name: he.decode(name),
    singer: he.decode(singer),
    cover,
    singerId,
    lyric,
    lyricOffset,
    page,
    biliShazamedName,
    nameRaw: name,
    parsedName: reExtractSongName(name, singerId),
    duration,
    album,
    addedDate: addedDate || new Date().getTime(),
    source,
    isLive,
    liveStatus,
    metadataOnLoad,
  };
};

export const setSongBiliShazamed = (
  song: NoxMedia.Song,
  val: string | null
) => {
  if (!val) return { ...song, biliShazamedName: val } as NoxMedia.Song;
  const biliShazamedName = extractParenthesis(val);
  return {
    ...song,
    biliShazamedName,
    nameRaw: song.name,
    name: biliShazamedName,
    parsedName: biliShazamedName,
  } as NoxMedia.Song;
};

export const removeSongBiliShazamed = (song: NoxMedia.Song): NoxMedia.Song => ({
  ...song,
  biliShazamedName: undefined,
  name: song.nameRaw,
  parsedName: reExtractSongName(song.name, song.singerId),
});

export const dummySong = (): NoxMedia.Song => {
  return {
    id: uuidv4(),
    bvid: '0',
    name: 'dummySong',
    nameRaw: 'dummySong',
    singer: 'dummyArtist',
    singerId: 0,
    cover: '',
    lyric: '',
    lyricOffset: 0,
    parsedName: 'dummySongParsed',
    biliShazamedName: '',
    page: 0,
    duration: 0,
  };
};

export const dummySongObj = dummySong();
