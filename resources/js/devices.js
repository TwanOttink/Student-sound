// global
let classroomsData = [];
let classrooms = [];
let latestRecords = [];

function fetchTData	() {
    // fetchpoint for request
    let xmlhttp = new XMLHttpRequest();
    let url = "http://10.80.17.1/throwdata.py";
    
    classroomsData = [];
    classrooms = [];
    latestRecords = [];

    // request status
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let measurements = JSON.parse(this.responseText);

            latestRecords = measurements.slice(0, 10);
            fillTable();

            for (i = 0; i < measurements.length; i++) {

                if( classroomsData[measurements[i].classroom] == undefined ) {
                    classroomsData[measurements[i].classroom] = [];
                    classrooms.push(measurements[i].classroom);
                }

                classroomsData[measurements[i].classroom].push({
                  x: moment.unix(measurements[i].unixtime),
                  y: measurements[i].waarde,
                })
            }

            drawAccordeon();
        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function drawAccordeon() {
    for (x = 0; x < classrooms.length; x++) {
        let volume = classroomsData[classrooms[x]][0].y;
        let color = 'yellow';
        if (volume > 50) {
            color = 'red';
        }
        let htmlElement = `
            <div class="device-item open">
                <div class="device-button subtitle">
                    <h4 class="device-title">Location: ${classrooms[x]}</h4>
                    <div class="device-columns">Last measurement:<span class="${color}">${Math.round(volume)} dB</span></div>
                </div>
                <div class="device-collapse collapse ">
                    <div class="device-body text">
                       <canvas id="chart-${x}" class="chart-01"></canvas>
                    </div>
                </div>
             </div>`;
        document.querySelector('#devices-wrapper').innerHTML += htmlElement;
        drawChart(classroomsData[classrooms[x]], x);
    }
}

function drawChart(object, count) {
    //chart object requires context, data and options
    let ctx = document.getElementById(`chart-${count}`).getContext('2d');

    let data = {
        datasets: [{
            label: "Decibel",
            borderColor: "rgba(0,220,220,0.5)",
            backgroundColor: "rgba(0,220,220,0.2)",
            pointBorderColor: "rgba(0,220,220,1)",
            data: object,
        },
        ],
    };
    let options = {
        title: { display: false, text: 'Weerstation' },
        scales: {
            xAxes: [{
                display: true,
                type: 'time',
                distribution: 'linear',
                ticks: { source: 'auto' },
                bounds: 'data',
                time: { unit: 'minute',
                    stepSize: 1,
                    displayFormats: { minute: 'H:mm:ss' },
                },
                scaleLabel: {
                    display: false,
                    labelString: 'Tijd',
                },
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'dB',
                },
                ticks: {
                    suggestedMin: 0.0,
                    suggestedMax: 50.0,
                },
            }],
        },
        elements: {
            line: {
                tension: 0,
            }
        },
    }

    // create chart with these parameters
    window.tempChart = new Chart(ctx, {
        type: 'line',
        data : data,
        options: options
    });

    throw new Error("Block second iteration due to bug in Chart.js");
}

function fillTable() {
    for (y = 0; y < latestRecords.length; y++) {
        let volume = latestRecords[y].waarde;
        let time = latestRecords[y].unixtime;
        let location = latestRecords[y].classroom;
        let color = '';
        if (volume > 50) {
            color = 'red';
        }
        let htmlElement = `
            <tr>
                <td class="${color}">${location}</td>
                <td class="${color}">${moment.unix(time).format('DD MMMM YYYY, HH:mm')}</td>
                <td class="${color}">${Math.round(volume)} dB</td>
            </tr>`;
        document.querySelector('#history_table').innerHTML += htmlElement;
    }
}

// create chart with fetched temperature data
window.onload = function() {
    fetchTData();
}

// refresh data
document.getElementById('refreshData').addEventListener('click', function() {
    document.querySelector('#devices-wrapper').innerHTML = '';
    fetchTData();
});