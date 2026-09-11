# Hero mist

How the spray in the hero works, and the numbers behind it. The code is in `src/components/mist/`: `mist-engine.ts` is plain TypeScript with no React, `MistCanvas.tsx` wires it into the page, and `mist-math.ts` holds the seeded randomness and noise (tested in `mist-math.test.ts`).

## Model

- Particles leave the nozzle in a 28° cone aimed at the pointer. The aim follows the pointer through a critically damped spring (0.4 s response) and the tin itself tilts by 30% of the aim.
- Droplet size follows a log-normal distribution: most droplets are tiny, a few are big enough to get a white highlight.
- Drag is divided by relative size, so small droplets stall and hang like haze while bigger ones travel further. Gravity is multiplied by size, so big droplets arc down.
- Turbulence comes from 2D Perlin noise and gets stronger with distance from the nozzle: the spray is tight where it leaves the can and loose at the edges.
- Moving the pointer through the mist pushes nearby droplets, using the pointer's velocity with a radial falloff.
- About a third of particles are drawn as large, faint "haze" sprites behind the droplets, which gives the plume some volume.
- New droplets take the colour of the oil in the selected tin.

## Behaviour

- Press and hold to spray; a tap gives a 0.25 s pulse. Choosing a flavour gives a short puff in that oil's colour. On load there's a single sweep across the headline.
- The engine starts once the browser is idle, stops its animation loop when nothing is moving, and pauses when the hero is off screen or the tab is hidden.
- With `prefers-reduced-motion`, it simulates about a second of spray off screen and draws one still frame.

## Performance

- Particles live in parallel typed arrays; a dead particle is replaced by the last one (swap-remove), so nothing is allocated per frame.
- Droplet sprites are pre-rendered once per colour and size bucket, then stamped with `drawImage`.
- The pixel ratio is capped at 2 and the particle budget scales with the canvas area (420 to 1,200).
- Randomness is seeded (mulberry32), so a given seed always produces the same spray.

## Parameters

| Parameter       | Default   | What it controls                                       |
| --------------- | --------- | ------------------------------------------------------ |
| Seed            | 175       | Which spray you get (175 is the net weight on the tin) |
| Particle budget | 1200      | Upper bound on live particles                          |
| Cone angle      | 28°       | Full width of the spray cone                           |
| Speed           | 880 px/s  | Initial droplet speed                                  |
| Drag            | 2.6 /s    | Speed lost per second, divided by relative size        |
| Gravity         | 90 px/s²  | Downward pull, multiplied by relative size             |
| Turbulence      | 260 px/s² | Noise-driven push at full distance from the nozzle     |
| Noise scale     | 0.006     | Size of the turbulent eddies                           |
| Haze            | 0.35      | Share of particles drawn as soft haze                  |
| Pulse           | 0.25 s    | Length of one tap                                      |
| Rate            | 2400 /s   | Particles emitted per second while spraying            |
