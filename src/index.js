#!/usr/bin/env node
"use strict";
const React = require("react");
const importJsx = require("import-jsx");
const { render } = require("ink");
const meow = require("meow");

const wizard = importJsx("./wizard/index");

const cli = meow(`
	Usage
	  $ solana-jupiter-bot

	Options
		--name  Your name

	Examples
	  $ solana-jupiter-bot --name=Jane
	  Hello, Jane
`);

console.clear();

render(React.createElement(wizard, cli.flags)).waitUntilExit();
