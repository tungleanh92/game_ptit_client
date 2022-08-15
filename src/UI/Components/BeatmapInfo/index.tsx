import React, { useContext } from 'react';
import { BeatmapFiles } from '../BeatmapUpload';
import style from './index.module.scss';
import { TransactionContext } from '../../../context/TransactionContext';

type Props = {
  beatmap?: BeatmapFiles;
  version?: string;
  onSelect: () => void;
};

export default function BeatmapInfo({ beatmap, version, onSelect }: Props) {
  const { joinGameData, handleChangeJoinGame
    // eslint-disable-next-line
   } = useContext<any>(TransactionContext);
  
  const diff = beatmap?.difficulties.find(d => d.data.version === version);

  if (beatmap == null || diff == null) {
    return <div className={style.info} />;
  }

  const min = Math.floor(diff.info.length / 60);
  const sec = Math.floor(diff.info.length % 60)
    .toString()
    .padStart(2, '0');

  return (
    <div className={style.info}>
      <div
        className={style.bg}
        style={
          diff.info.background
            ? {
              backgroundImage: `url(${diff.info.background})`
            }
            : {}
        }
      />
      <div className={style.metadata}>
        <h1>
          {diff.data.title} [{diff.data.version}]
        </h1>
        {diff.data.source && <p>From {diff.data.source}</p>}
        {diff.data.artist && <p>By {diff.data.artist}</p>}
        <p>Mapped by {diff.data.creator}</p>

        <p>
          Length: {min}:{sec}
        </p>
      </div>
      <p style={{margin: '10px 16px'}} >Choose amount of token to play</p>
      <select
        placeholder="Amount (ETH) to play game"
        value={joinGameData}
        onChange={handleChangeJoinGame}
        style={{margin: '0 16px'}}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
      >
        <option value="100">100</option>
        <option value="200">200</option>
        <option value="300">300</option>
      </select>
      <button className={style.playButton} onClick={onSelect}>
        Play
      </button>
    </div>
  );
}
