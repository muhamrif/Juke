import React, { useState, useEffect } from "react";
import Main from "./Main";

// creates the Audio element
// While the Audio element is part of HTML5, it doesn't `visually` show up anywhere in the DOM.
// However, we interact with it the same way we would a DOM node. That's pretty cool!

const AUDIO = document.createElement("audio");

// Some utility functions

const mod = (num, m) => ((num % m) + m) % m;

const skip = (interval, { currentSongList, currentSong }) => {
  let idx = currentSongList.map((song) => song.id).indexOf(currentSong.id);
  idx = mod(idx + interval, currentSongList.length);
  const next = currentSongList[idx];
  return [next, currentSongList];
};

// The stateful Audio component

const Audio = () => {
  const [currentSong, setCurrentSong] = useState({});
  const [currentSongList, setCurrentSongList] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    AUDIO.addEventListener("ended", () => next());

    return () => {
      AUDIO.removeEventListener("ended");
    };
  }, []);

  function play() {
    AUDIO.play();
    setIsPlaying(true);
  }

  function pause() {
    AUDIO.pause();
    setIsPlaying(false);
  }

  function load(currentSong, currentSongList) {
    AUDIO.src = currentSong.audioUrl;
    AUDIO.load();

    setCurrentSong(currentSong);
    setCurrentSongList(currentSongList);
  }

  function startSong(song, list) {
    pause();
    load(song, list);
    play();
  }

  function toggleOne(selectedSong, selectedSongList) {
    if (selectedSong.id !== currentSong.id) {
      startSong(selectedSong, selectedSongList);
    } else {
      toggle();
    }
  }

  function toggle() {
    if (isPlaying) pause();
    else play();
  }

  function next() {
    startSong(...skip(1, this.state));
  }

  function prev() {
    startSong(...skip(-1, this.state));
  }

  return (
    <Main
      currentSong={currentSong}
      isPlaying={isPlaying}
      prev={prev}
      next={next}
      toggleOne={toggleOne}
      toggle={toggle}
    />
  );
};

export default Audio;
