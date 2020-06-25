const reader = new FileReader()


//Essa função executa ao escolher o arquivo no passo 1
//O passo 2 e 3 são dependentes em forma de cascata
function read(input) {
    const csv = input.files[0]
    reader.readAsText(csv)
}
reader.onload = function (e) {
    csvJSON(e.target.result)
}
function csvJSON(csv) {
    let lines = csv.split("\n");
    let result = [];
    //var headers = lines[0].split(";");
    headers = ["local", "populacao"]

    //console.log(headers);
    for (let i = 1; i < lines.length - 1; i++) {
        let obj = {};
        let currentline = lines[i].split(";");
        cleanCity = currentline[0].replace(/(^"|"$)/g, '');
        cleanPopulation = currentline[1].replace(/(^"|"$)/g, '');
        cleanLine = [cleanCity, cleanPopulation]

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = cleanLine[j];

        }
        result.push(obj);
    }
    $("#tbodyTarefa1").html("")
    result.map((dado, index) => {
        let tr = ("<tr><td>" + index + "</td>" +
            "<td>" + dado.local + "</td>" +
            "<td>" + dado.populacao + "</td>"
        )
        $("#tbodyTarefa1").append(tr)
    })

    //Função que executa no clique do botão Multiplicar População
    multiplicarPor2 = () => {
        $("#tbodyTarefa1").html("")
        result.map((dado, index) => {
            let tr = ("<tr><td>" + index + "</td>" +
                "<td>" + dado.local + "</td>" +
                "<td>" + dado.populacao * 2 + "</td>"
            )
            $("#tbodyTarefa1").append(tr)
        })

        //Função que executa ao clicar no botão Exportar
        //Lê o JSON result criado acima e trasnforma em CSV
        downloadCSV = () => {
            JSON2CSV(result);
            function JSON2CSV(objArray) {
                var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
                var str = '';
                var line = '';

                let titles = [];
                for (var i = 0; i < array.length; i++) {
                    let obj = array[i];
                    Object.entries(obj).forEach(([key, value]) => {
                        //console.log('key=', key, "   val="; value );
                        if (titles.includes(key)) {
                            // console.log (key ; 'exists');
                            null;
                        }
                        else {
                            titles.push(key);
                        }
                    })
                }
                let htext = ('"Local";"População no último censo"');
                str += htext + '\r\n';
                for (var i = 0; i < array.length; i++) {
                    var line = '';
                    for (var j = 0; j < titles.length; j++) {
                        let obj = array[i];
                        let keyfound = 0;
                        Object.entries(obj).forEach(([key, value]) => {
                            if (key == titles[j]) {
                                line += ';"' + value + '"';
                                keyfound = 1;
                                return false;
                            }

                        })
                        if (keyfound == 0) {
                            line += ',"' + '"';   // add null value for this key
                        } // end loop of header values
                    }
                    str += line.slice(1) + '\r\n';
                }
                //Trecho responsável por fazer o download
                //Cria um elemento a, atribui um link de download, ativa o link e 
                //exclui o elemento no final
                var downloadLink = document.createElement("a");
                var blob = new Blob(["\ufeff", str]);
                var url = URL.createObjectURL(blob);
                downloadLink.href = url;
                downloadLink.download = "mapa.csv"; //Nome do arquivo
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                return str;
            }
        }

    }





}