# Todone

Hacky script to generate a list of completed tasks from MS Todo using Microsoft's Graph API.

## Usage

1. Run `npm i`
1. Rename `.config.sample.js` to `.config.js`
1. Get an Access Token (see below)
1. Paste your Access Token into `.config.js`
1. Finally, run `node todone` (or `node todone >> todone.txt`)

## Access Tokens
1. Open [Graph Explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
1. Click `Sign in to Graph Explorer` and login with your MS/Outlook/365 account
1. In the main panel, click the `Access token` tab, et voilà!

## Options

`.config.js` contains some extra options:

- `ignoreLists`: List names to exclude
- `start`: Earliest date for completed tasks
- `end`: Latest date for completed tasks

## Why?

1. To review how productive I've been this month
1. To learn how to use Promises
1. An excuse for a product person to do some coding :)
