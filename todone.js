const { Client } = require("@microsoft/microsoft-graph-client")
const emojiRegex = require('emoji-regex');
const config = require("./.config.js")
require("isomorphic-fetch")

// MS Graph API Client
const client = Client.init({
	defaultVersion: "v1.0",
	debugLogging: false,
	authProvider: (done) => {
		let ACCESS_TOKEN = config.accessToken.trim()
		done("Error thrown by the authentication handler", ACCESS_TOKEN)
	},
})

// Gets task lists, filtering those in `.config.js`
const getLists = function(filter = []) {
	return new Promise(function(resolve, reject) {
		client
			.api("/me/todo/lists")
			.get()
			.then(res => {
				lists = res.value
				lists = lists.filter(list => !filter.includes(list.displayName))
				resolve(lists)
			})
	})
}

// Gets tasks completed between dates in `.config.js`
const getTasks = function(id, name) {
	return new Promise(function(resolve, reject) {
		client
			.api("/me/todo/lists/" + id + "/tasks")
			.get()
			.then(res => {
				res = res.value

				// Filter incomplete first bc missing `completedDateTime` causes error
				res = res.filter(task => task.status === "completed")

				// Only tasks completed within dates in `.config.js`
				res = res.filter(task => {
					let completed = new Date(task.completedDateTime.dateTime),
						start     = new Date(config.start),
						end       = new Date(config.end)
					return (completed > start && completed < end)
				})

				// Sort by most recently completed and prepend list name
				res.sort((a, b) => new Date(b.date) - new Date(a.date))
				res.unshift({
					title: name,
					plain: name.replace(emojiRegex(), "").trim()
				})

				resolve(res)
			})
	})
}

// Output the final list
getLists(config.ignoreLists).then(lists => {

	// Promise Pokédex
	let promises = []
	lists.forEach(list => {
		promises.push(getTasks(list.id, list.displayName))
	})

	// Gotta catch 'em all!
	return Promise.all(promises).then(lists => {

		// Total task count
		let tasks = 0

		// Sort lists by plaintext name
		lists.sort((a, b) => a[0].plain < b[0].plain ? -1 : 1)

		// Output each list's tasks
		lists.forEach(list => {

			// List name + number of completed tasks
			let header = list.shift().title + " (" + list.length + ")"

			// Task list
			if (list.length > 0) {
				tasks += list.length
				console.log(header)
				list.forEach(task => console.log(task.title))
				console.log()
			}

		})

		// Total task count
		console.log(tasks + " tasks completed between " + config.start + " & " + config.end)

	})

})
