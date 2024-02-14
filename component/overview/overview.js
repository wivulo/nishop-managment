import { httpGET } from "../../util/http.js";
import { create } from "../../util/createElement.js";

const ctx = document.getElementById('lineChart');

const listContainer = document.getElementById("products");


(async () => {
  const res = await httpGET("../../data/data.json").catch(e => console.log(e));
  const product = res.product;

  const max_quantity = 5;
  let temp = [...product].sort((a, b) => b.saled - a.saled);
  let fiveMostSaled = temp.slice(0, max_quantity);

  const DATA_COUNT = 7;
  const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

  const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  const actions = [
    {
      name: 'Randomize',
      handler(chart) {
        chart.data.datasets.forEach(dataset => {
          dataset.data = Utils.numbers({ count: chart.data.labels.length, min: -100, max: 100 });
        });
        chart.update();
      }
    },
  ];

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Dataset',
        data: [10, 30, 20, 40, 25, 35, 50],
        borderColor: "rgb(255, 187, 0)",
        backgroundColor: "rgba(255, 187, 0, 0.5)",
        yAxisID: 'y',
      }
    ]
  };

  const config = {
    type: 'line',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      stacked: false,
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
        },
      }
    },
    actions: actions,
  };

  new Chart(ctx, config);


  fiveMostSaled.map(p => {
    let productListItem = create("tr", [{ id: p.id }],
    `
      <th scope="row">
        <img src="${p.imageSrc}" alt="${p.description}" width="50" height="50"/>
      </th>
      <td>${p.name}</td>
      <td>$ ${p.price}</td>
      <td>${p.saled}</td>
    `);
    // <div class="flex justify-center items-center w-10">
    //   <img src="${p.imageSrc}" alt="${p.description}" width="50" height="50"/>
    // </div>
    // <div class="flex flex-col w-80 gap-5 ml-10">
    //   <p>${p.name} - ${p.saled} sales</p>
    //   <p>${p.description}</p>
    //   <p class="text-sx text-darkgray">$ ${p.price}</p>
    // </div>
    // `
    // )

    // productListItem.classList.add("flex")
    // productListItem.classList.add("bg-gray-50")

    listContainer.appendChild(productListItem);
  })

})()