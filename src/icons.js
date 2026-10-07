// Local vector artwork: never depends on an operating system emoji font.
const paths={
 fire:'<path d="M13 2c1 5-3 5-1 9 1-1 2-2 2-4 4 3 6 6 5 10-1 4-4 5-7 5s-7-2-7-6c0-4 3-7 5-9-1 4 0 5 1 6 2-4 0-6 2-11Z"/>',
 water:'<path d="M12 2C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-13Z"/><path d="M8 15c0 2 1 3 3 4"/>',
 earth:'<path d="m3 16 4-10 7-3 6 7 1 8-9 3Z"/><path d="m7 6 5 7 8-3M12 13v8M3 16l9-3"/>',
 wind:'<path d="M3 7h12a3 3 0 1 0-3-3M2 12h17a3 3 0 1 1-3 3M4 17h6a3 3 0 1 1-3 3"/>',
 leaf:'<path d="M20 3C7 2 2 8 5 15c5 9 17 3 15-12Z"/><path d="m3 22 14-15M7 18l-1-6M11 14l6 1"/>',
 attack:'<path d="m15 3 6 0v6L9 21l-6-6Z"/><path d="m7 11 6 6M3 21l4-4M5 13l6 6"/>',
 shield:'<path d="m12 2 8 3v6c0 5-4 9-8 11-4-2-8-6-8-11V5Z"/><path d="m8 12 3 3 5-6"/>',
 heart:'<path d="M12 21 3 12C-2 5 7-1 12 6c5-7 14-1 9 6Z"/>',
 poison:'<path d="M5 11a7 7 0 1 1 14 0v4l-3 2v4H8v-4l-3-2Z"/><circle cx="9" cy="11" r="1.5"/><circle cx="15" cy="11" r="1.5"/><path d="m11 15 1-2 1 2M11 18v3M14 18v3"/>',
 stun:'<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z"/>',
 root:'<path d="M12 12V3M12 8C6 9 4 5 4 3c5-1 8 1 8 5Zm0-1c0-4 4-5 8-4 0 3-3 6-8 4ZM12 12l-5 4-3 5M12 12l5 4 3 5M7 16l-4-1M17 16l4-1M12 12v10"/>',
 mist:'<path d="M4 8h16M2 12h16M6 16h16M3 20h12M7 4h10"/>',
 target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4"/>',
 eye:'<path d="M2 12S6 5 12 5s10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
 charge:'<path d="m14 2-9 12h6l-1 8 9-12h-6Z"/>',
 combo:'<path d="m12 2 2 6 6-3-3 6 5 2-6 2 3 6-6-3-3 4-1-6-7 1 5-5-4-5 7 1Z"/>',
 trophy:'<path d="M7 3h10v6c0 4-2 6-5 6s-5-2-5-6ZM7 5H3v3c0 3 2 5 5 5M17 5h4v3c0 3-2 5-5 5M12 15v6M7 22h10"/>',
 sparkle:'<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>',
 cloud:'<path d="M6 19a5 5 0 1 1 1-10 6 6 0 0 1 12 2 4 4 0 0 1 0 8Z"/>',
 collection:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
 energy:'<path d="m12 2 8 10-8 10-8-10Z"/>',
 'energy-empty':'<path d="m12 2 8 10-8 10-8-10Z"/>',
 switch:'<path d="M3 7h17l-4-4M21 17H4l4 4M20 7l-4 4M4 17l4-4"/>',
 check:'<path d="m4 12 5 5L20 6"/>',
 waiting:'<circle cx="12" cy="12" r="8"/>',
 plus:'<path d="M12 4v16M4 12h16"/>',
 close:'<path d="m5 5 14 14M5 19 19 5"/>',
 'arrow-right':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 'arrow-left':'<path d="M20 12H4m6-6-6 6 6 6"/>',
 log:'<path d="M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1"/>',
 sound:'<path d="m3 9 5 0 5-5v16l-5-5H3ZM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14"/>',
 'sound-off':'<path d="m3 9 5 0 5-5v16l-5-5H3ZM17 9l5 6M17 15l5-6"/>'
};
export function icon(name){
 if(!Object.hasOwn(paths,name))throw Error(`Unknown icon: ${name}`);
 return `<svg class="ui-icon icon-${name}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}
