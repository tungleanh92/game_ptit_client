import React, { useCallback, useEffect, useRef, useState, useContext } from 'react';
import Game, { BeatmapFile, Stats } from '../Game';
import { BeatmapData } from '../Game/Loader/BeatmapLoader';
import { onPause } from '../Game/lock';
import { PauseScreen } from './Components/PauseScreen';
import ResultModal from './Components/ResultModal';
import style from './index.module.scss';
import Menu from './Menu';
import { CursorType, defaultOptions, Options } from './options';
import { TransactionContext } from '../context/TransactionContext';
import { errors } from 'ethers';

type Props = {
  supportsRawInput: boolean;
};

const g = new Game(document.getElementsByTagName('canvas')[0]);

export default function Root({ supportsRawInput }: Props) {
  const game = useRef(g);
  const [gameLoaded, setGameLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);
  const [options, setOptions] = useState({
    ...defaultOptions,
    rawInput:
      !supportsRawInput && defaultOptions.cursorType === CursorType.UNADJUSTED
        ? CursorType.LOCKED
        : defaultOptions.cursorType,
    supportsRawInput,
    setOptions: (o: Partial<Options>) =>
      setOptions(options => ({ ...options, ...o }))
  });
  const [result, setResult] = useState<Stats | null>(null);
  const { joinGame, winnerClaim
    // eslint-disable-next-line
   } = useContext<any>(TransactionContext);

  // Update game options
  useEffect(() => {
    game.current.setOptions(options);
  }, [options]);

  // Game done callback
  useEffect(() => {
    game.current.onDone(stats => {
      setResult(stats);
      setPlaying(false);
      setPaused(false);
    });
  }, []);

  const onPlay = useCallback(
    async (data: BeatmapData, files: BeatmapFile[]) => {
      // Load game
      if (!gameLoaded) {
        await game.current.init();
        setGameLoaded(true);
      }

      // Get background image
      const bgFile = files.find(f => f.name === data.background.filename);
      if (bgFile == null) {
        console.warn('Missing background image:', data.background.filename);
      }

      // Get audio
      const audioFile = files.find(f => f.name === data.audioFilename);
      if (audioFile == null) {
        alert("This beatmap is missing its audio file and can't be played!");
        return;
      }
      
      // Load beatmap
      await game.current.loadBeatmap(data, bgFile, audioFile);
      setPlaying(true);
      setPaused(false);
      game.current.play();
      await joinGame()
    },
    [gameLoaded]
  );

  // Playback control
  const onResume = () => {
    setPaused(false);
    game.current.resume();
  };

  const onQuit = () => {
    setPlaying(false);
    setPaused(false);
    game.current.quit();
  };

  useEffect(() => {
    onPause(() => {
      if (game.current.isPlaying()) {
        setPaused(true);
        game.current.pause();
      }
    });
  }, []);

  useEffect(() => {
    if (!playing && result) {
      const doWinnerClaim = async () => {
        await winnerClaim()
      }
    
      console.log(playing, 'playing');
      const accuracy = (result.gameResult.accuracy * 100).toLocaleString('en-US', {
        maximumFractionDigits: 2
      });
      // if (parseInt(accuracy) >= 75) {
        // sign win game 
        doWinnerClaim().catch(console.error)
      // }
      console.log(parseInt(accuracy));
      console.log(typeof(parseInt(accuracy)));
    }
  }, [playing])

  return (
    <>
      <div className={playing ? style.playingRoot : style.root}>
        <ResultModal result={result} onClose={() => setResult(null)} />
        <Menu options={options} onSelect={onPlay} />
      </div>
      {paused && (
        <PauseScreen onResume={onResume} onQuit={onQuit} />
      )}
    </>
  );
}
