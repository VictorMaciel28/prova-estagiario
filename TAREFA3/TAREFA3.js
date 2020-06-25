//Essa função executa ao escolher o arquivo no passo 1
//O passo 2 e 3 são dependentes em forma de cascata
function read3(input) {
    const csv = input.files[0]
    reader3 = new FileReader();
    reader3.readAsText(csv)
    reader3.onload = function (e) {
        $("#tbodyTarefa3").html("")
        csvJSONtarefa3(e.target.result)
    }
}
//Aqui o csv é transformado em JSON e preenche 
//os dados na tabela
function csvJSONtarefa3(csv) {
    let lines = csv.split("\n");
    let result = [];
    //var headers = lines[0].split(";");
    headers = ["local", "populacao"]
    let fullresposta = []
    for (let i = 1; i < lines.length - 1; i++) {
        let obj = {};
        let currentline = lines[i].split(";");
        let cep = (currentline[0]);
        $("#tbodyTarefa3").html("")
        $.ajax({
            url: 'https://viacep.com.br/ws/' + cep + '/json/unicode/',
            dataType: 'json',
            success: function (resposta) {
                let tr = ("<tr>" +
                    "<td>" + resposta.cep + "</td>" +
                    "<td>" + resposta.logradouro + "</td>" +
                    "<td>" + resposta.complemento + "</td>" +
                    "<td>" + resposta.bairro + "</td>" +
                    "<td>" + resposta.localidade + "</td>" +
                    "<td>" + resposta.uf + "</td>" +
                    "<td>" + resposta.unidade + "</td>" +
                    "<td>" + resposta.ibge + "</td>" +
                    "<td>" + resposta.gia + "</td></tr>"
                )
                $("#tbodyTarefa3").append(tr)
                fullresposta.push(resposta)
                listenerBtnDownloadCSV(fullresposta);
            },
            error: function (err) {
                fullresposta.push({ cep: cep })
                let terr = ("<tr><td>" + cep + "<td><td>Cep Incorreto</td></tr>")
                $("#tbodyTarefa3").append(terr)
                listenerBtnDownloadCSV(fullresposta);

            }
        });
    }

    $("#tbodyTarefa3").html("")
    result.map((dado, index) => {
        let tr = ("<tr>" +
            "<td>" + dado.local + "</td>" +
            "<td>" + dado.populacao + "</td>"
        )
        $("#tbodyTarefa3").append(tr)
    })
    //Função que é executada dentro da promisse e aguarda
    //o clique de download pelo cliente.
    //Lê o JSON result criado acima e trasnforma em CSV
    listenerBtnDownloadCSV = (fullresposta) => {
        downloadCSVTarefa3 = () => {
            console.log(fullresposta);
            JSON2CSV(fullresposta);
            //Trecho responsável por transformar o JSON em csv
            function JSON2CSV(objArray) {
                let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
                let str = '';
                let line = '';

                let titles = [];
                for (let i = 0; i < array.length; i++) {
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
                let htext = ('CEP;Logradouro;Complemento;Bairro;Localidade;UF;Unidade;IBGE;GIA');
                str += htext + '\r\n';
                for (let i = 0; i < array.length; i++) {
                    let line = '';
                    for (let j = 0; j < titles.length; j++) {
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
                let downloadLink = document.createElement("a");
                let blob = new Blob(["\ufeff", str]);
                let url = URL.createObjectURL(blob);
                downloadLink.href = url;
                downloadLink.download = "CEPs.csv"; //Nome do arquivo
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
                return str;
            }
        }
    }

}