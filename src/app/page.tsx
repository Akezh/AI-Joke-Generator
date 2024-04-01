"use client";

import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slider } from '@mui/material';
import { useUIState, useActions } from "ai/rsc";
import type { AI } from './action';
import { topics, tones, kinds } from './constants';

export default function Home() {
  const [topic, setTopic] = React.useState<string | undefined>(undefined);
  const [tone, setTone] = React.useState<string | undefined>(undefined);
  const [kind, setKind] = React.useState<string | undefined>(undefined);
  const [temperature, setTemperature] = React.useState<number | undefined>(0);

  const [messages, setMessages] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions<typeof AI>();
  
  const handleTopicChange = (event: SelectChangeEvent) => {
    setTopic(event.target.value as string);
  };
  
  const handleToneChange = (event: SelectChangeEvent) => {
    setTone(event.target.value as string);
  };
  
  const handleKindChange = (event: SelectChangeEvent) => {
    setKind(event.target.value as string);
  };

  const handleTemperatureChange = (event: Event, newValue: number | number[]) => {
    setTemperature(newValue as number);
  };

  const handleGenerateJoke = async () => {
    const prompt = 'Generate a joke about ' + topic + ' with a ' + tone + ' tone that is ' + kind;
    
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: Date.now(),
        display: <div style={{ marginBottom: 16 }}><span style={{ color: 'green' }}>USER: </span>{prompt}</div>,
      },
    ]);
    const responseMessage = await submitUserMessage(prompt);
    setMessages((currentMessages) => [
      ...currentMessages,
      {
        ...responseMessage,
        display: <div style={{ marginBottom: 16 }}><span style={{ color: 'blue' }}>AI ASSISTANT: </span>{responseMessage.display}</div>,
      },
    ]);
  }
  
  return (
    <div className="px-4 py-6 md:px-6 lg:py-12 h-full">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-0">
        <div className="space-y-6 lg:col-start-3 lg:col-span-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Generate Jokes</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Select the parameters for your joke and let the AI work its magic.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-8">
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Topic</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={topic}
                    label="Topic"
                    onChange={handleTopicChange}
                  >
                    {
                      topics.map((topic) => (
                        <MenuItem key={topic} value={topic}>{topic}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Tone</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tone}
                    label="Tone"
                    onChange={handleToneChange}
                  >
                    {
                      tones.map((tone) => (
                        <MenuItem key={tone} value={tone}>{tone}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ minWidth: 200 }}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Kind</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={kind}
                    label="Kind"
                    onChange={handleKindChange}
                  >
                    {
                      kinds.map((kind) => (
                        <MenuItem key={kind} value={kind}>{kind}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: 200, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Slider aria-label="Temperature" value={temperature} onChange={handleTemperatureChange} />
                  <Typography>{(temperature ?? 0)/20}</Typography>
              </Box>
            </div>
            <Button variant='contained' onClick={handleGenerateJoke}>Generate Joke</Button>
            <div style={{ height: 400, width: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
              {
                messages.map((message) => (
                  <div key={message.id}>
                    {message.display}
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}