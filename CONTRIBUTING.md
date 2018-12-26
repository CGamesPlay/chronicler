# Contributing to Chronicler

First off, thank you for considering contributing to Chronicler! Chronciler is a small personal project made to fill a specific need for myself, and I'm happy to see that you are interested using it to help your own use case as well.

This document provides some guidelines to ensure that bug reports, pull requests, and other contributions flow smoothly. By following these guidelines, you are signalling to me that you respect my time and energy, and I will reciprocate by showing you the same respect when working with you.

### Project goals

Contributions are most appreciated when they are in line with the project's goals. The goals of Chronicler are, in order:

1. **Chronicler is reliable.** Chronicler must never suffer from data loss. This priority comes before all others in this list.
2. **Chronicler is easy to use.** All of Chronicler's features should be usable without requiring a manual, and ideally without any training at all.
3. **Chronicler is fast.** Chronicler should be as fast as possible, but this shouldn't get in the way of reliability or ease of use.
4. **Chronicler is the ideal tool for personal web archiving.** New features that make Chronicler better for this task are welcomed while features that do not are encouraged to be built as separate software that interoperates with Chronicler.

### How to contribute

Chronicler is very young and there are many ways where it can be improved. In general, contributions that work towards the goals of the project are always welcomed. Some ways that you can help contribute include:

- **Asking for help with a Chronicler issue.** If you can't get a feature to work as expected, then Chronicler isn't being easy to use. Sharing your experience may help resolve the issue, and may help others in the future as well.
- **Explaining your use case and why Chronicler failed you.** Did the program crash? Is there a feature that doesn't work on a particular site? Sharing your experience with the community can help make the software better. I can't promise I'll be able to implement every feature request, though.
- **Making a pull request.** Changes that advance the goals of the project are welcomed!

### Code of conduct

- Be civil. Don't say things you wouldn't say face-to-face. Don't be snarky. Comments should get more civil and substantive, not less, as a topic gets more divisive.
- When disagreeing, please reply to the argument instead of calling names. "That is idiotic; 1 + 1 is 2, not 3" can be shortened to "1 + 1 is 2, not 3."
- Please respond to the strongest plausible interpretation of what someone says, not a weaker one that's easier to criticize. Assume good faith.
- Be Open, Considerate, and Respectful as described in the [Python Community Code of Conduct](https://www.python.org/psf/codeofconduct/).
- This project abides by the [Contributor Covenant](https://www.contributor-covenant.org/version/1/4/code-of-conduct).

## Running Chronicler from source

### Development Scripts

```bash
# run application in development mode
yarn dev

# compile source code and create webpack output
yarn compile

# `yarn compile` & create build with electron-builder
yarn dist

# `yarn compile` & create unpacked build with electron-builder
yarn dist:dir
```

### Useful links

- http://vcap.me/ - this domain always resolves to 127.0.0.1. I use it as a guaranteed offline domain.
- http://httpstat.us/ - useful for testing different HTTP status codes.
- https://badssl.com/ - useful for testing different SSL error conditions.