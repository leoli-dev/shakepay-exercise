# shakepay-exercise

Shakepay Programming exercise for showing customer net worth over time.

- Time limit: 3h

## Result

![image](https://i.imgur.com/IpAzYCH.png)

## How to run the application

- Option 1: You can setup a web server locally and put all this repo inside the `public` folder, then access to the index page. For example: `http://127.0.0.1`

- Option 2: Open this repo by VS code, install the `Live Server` extension of VS code, then right click on `index.html` file and choose `Open with Live Server`.

## Tech stack

- HTML + Vanilla JS
- [canvasJS](https://canvasjs.com/javascript-charts/line-chart-axis-scale-breaks/)

## Things could be improved

1. I downloaded the json into the repo in order to avoid CORS error. If I have enough time, I can build it with node.js as the backend, and the data fetch could be done inside the backend so that the API data will be able keep up-to-date.

2. Right now I use the constant rate, but with enough time I can apply the dynamic rate depend on the date.

3. canvasJS provides event handling: [link](https://canvasjs.com/docs/charts/basics-of-creating-html5-chart/event-handling/). In my plan for next version, I would like to display a table below the chart for showing the transactions of one day based on the `Mouseover event` of canvasJS.
