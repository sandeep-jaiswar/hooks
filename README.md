# @sandeep-jaiswar/hooks

A collection of highly useful and reusable React hooks that enhance the development experience with features like long press handling, media query detection, state management, and more.

This package is designed to provide a set of flexible hooks to help manage common UI and state-related functionality in your React applications. It is optimized for performance and supports both mouse and touch events.

## Installation

You can install the package via npm or yarn:

### npm

```bash
npm install @sandeep-jaiswar/hooks
````

### yarn

```bash
yarn add @sandeep-jaiswar/hooks
```

### Bun

```bash
bun add @sandeep-jaiswar/hooks
```

## Available Hooks

Here is a list of hooks currently available in `@sandeep-jaiswar/hooks`:

### `useLongPress`

A hook to handle long press interactions for both mouse and touch events.

#### Usage

```tsx
import { useLongPress } from '@sandeep-jaiswar/hooks';

const Component = () => {
  const [ref, isPressed] = useLongPress({
    onLongPress: () => console.log('Long press triggered'),
    onPress: () => console.log('Short press triggered'),
    threshold: 700, // Optional, default is 500ms
  });

  return <button ref={ref}>Press Me</button>;
};
```

### `useMediaQuery`

Detects whether the current screen matches a given media query.

#### Usage

```tsx
import { useMediaQuery } from '@sandeep-jaiswar/hooks';

const Component = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      {isMobile ? 'Mobile View' : 'Desktop View'}
    </div>
  );
};
```

### `useHover`

Detects if an element is hovered or not.

#### Usage

```tsx
import { useHover } from '@sandeep-jaiswar/hooks';

const Component = () => {
  const [ref, isHovered] = useHover();

  return <div ref={ref}>{isHovered ? 'Hovered' : 'Not Hovered'}</div>;
};
```

### `usePrevious`

Stores the previous value of a state or prop.

#### Usage

```tsx
import { usePrevious } from '@sandeep-jaiswar/hooks';

const Component = () => {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);

  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Count: {prevCount}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};
```

### `useBattery`

Detects the battery status of the device.

#### Usage

```tsx
import { useBattery } from '@sandeep-jaiswar/hooks';

const Component = () => {
  const battery = useBattery();

  return (
    <div>
      {battery ? (
        <p>Battery Level: {battery.level}%</p>
      ) : (
        <p>Battery status not available</p>
      )}
    </div>
  );
};
```

### `useIdle`

Detects whether the user is idle or active.

#### Usage

```tsx
import { useIdle } from '@sandeep-jaiswar/hooks';

const Component = () => {
  const isIdle = useIdle(5000); // Trigger idle state after 5 seconds of inactivity
  
  return <div>{isIdle ? 'User is idle' : 'User is active'}</div>;
};
```

## Development

If you want to contribute to this project, follow these steps to set up the development environment:

1. Clone the repository:

```bash
git clone https://github.com/sandeep-jaiswar/hooks.git
```

2. Install dependencies:

```bash
bun install
```

3. Run the development server:

```bash
bun run dev
```

4. Build the package:

```bash
bun run build
```

5. Test the hooks:

```bash
bun run test
```

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request with any improvements, bug fixes, or new hooks.

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Acknowledgements

* This repository is maintained by [Sandeep Jaiswar](https://github.com/sandeep-jaiswar).
* Thanks to all contributors to the React ecosystem for making these hooks possible!
