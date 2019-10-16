var botao = document.getElementById("botao");
var botaoLimpar = document.getElementById("limpar")
var rank = document.getElementById("rank");
var arrTimes = Array();
var campeonato = Array();
function Times(id, nome, estado){
    this.id = id;
    this.nome = nome;
    this.estado = estado;
    this.pontos = 0;
}


botaoLimpar.addEventListener('click', function(){
    limparTabela("turno")
    limparTabela("returno")
    
})

botao.addEventListener('click', function(){
    limparTabela("turno")
    limparTabela("returno")
    criarListaTimes(document.getElementById('txtTimes').value);
    criarObjetosTimes(arrTimes)
    campeonato = new Tournament(arrTimes.length)
    eliminarFantasma(campeonato);
    gerarTabela(campeonato);
    
    arrTimes = ordenarVencedor(arrTimes)
    
    
    rank.innerHTML = listarVencedor(arrTimes);
    
});


//função para colocar lista de times em ordem de pontos no rank

function listarVencedor(lista){
    var texto = ""
    for (var x = 0; x < lista.length; x++){
        if(x == 0){
            texto += "<strong>(VENCEDOR)" + lista[x][0] + " | " + lista[x][1] + " Pontos </strong><br>"
            x++;
        }
        texto += lista[x][0] + " | " + lista[x][1] + " Pontos<br>" 
    }
    return texto;
}

//Colocar em ordem de mais pontos

function ordenarVencedor(arrTimes){
    var timesOrdem = []
    for(var i = 0; i < arrTimes.length; i++){
        timesOrdem.push([arrTimes[i].nome, arrTimes[i].pontos])
    }
    timesOrdem.sort(function(a,b){
        return a[1] - b[1];
    })
    if (timesOrdem[0][0] == "fantasma"){
        timesOrdem.shift();
    }
    return timesOrdem.reverse();
}

//Gerar Jogos

function gerarJogo(time1, time2){
    var vencedor = Math.floor(Math.random()*3);
    
    if(vencedor == 0){
        time1.pontos += 3;
        return time1.nome
    }
       else if(vencedor == 1){
        time2.pontos += 3;
        return time2.nome
       }
        else{
            time1.pontos += 1;
            time2.pontos += 1;
            return "Empate"
        }
}

//mostrar jogos

 function gerarTabela(){
        for(var x = 0; x < campeonato.rounds.length; x++){
            for(var i = 0; i < campeonato.rounds[x].pairs.length; i++){
                var time1 = campeonato.rounds[x].pairs[i].one 
                var time2 = campeonato.rounds[x].pairs[i].two
                var estado = campeonato.rounds[x].pairs[i].one.estado
                var restado = campeonato.rounds[x].pairs[i].two.estado
                
                
                    if(i > 0 && campeonato.rounds[x].pairs[i].one.estado === campeonato.rounds[x].pairs[i -1 ].one.estado){
                        estado = campeonato.rounds[x].pairs[i].one.estado + " (RODADA DUPLA)"
                    }
                
                    if(i>0 && campeonato.rounds[x].pairs[i].two.estado === campeonato.rounds[x].pairs[i -1 ].two.estado){
                        restado = campeonato.rounds[x].pairs[i].two.estado + " (RODADA DUPLA)"
                    }
                
                var round = campeonato.rounds[x].r
                
                criarTabela(time1,time2, estado, round, "turno", "")
                criarTabela(time2, time1, restado, round + arrTimes.length - 1, "returno", "")
 
            }
        }
    }

//Preencher tabelas no HTML
function criarTabela(time1, time2, estado, round, tabela, vencedor){
    var textNode1 = time1.nome + " x " + time2.nome;
    var textNode2 = estado;
    var textNode3 = round;
    var textNode4 = gerarJogo(time1, time2);
    var tr = document.createElement("tr");
    var td = tr.appendChild(document.createElement('td'));
    var td2 = tr.appendChild(document.createElement('td'));
    var td3 = tr.appendChild(document.createElement('td'));
    var td4 = tr.appendChild(document.createElement('td'));
    td.innerHTML = textNode1;
    td2.innerHTML = textNode2;
    td3.innerHTML = textNode3;
    td4.innerHTML = textNode4;
    document.getElementById(tabela).appendChild(tr);
    
}

//limpar tabela

function limparTabela(lista){
    var lista = document.getElementById(lista)
    if(lista.hasChildNodes()){
        for(var i = lista.childElementCount; i > 1; i--){
            lista.removeChild(lista.childNodes[i]);
        }
    };
}

//eliminar os fantasmas.

function eliminarFantasma(campeonato){
    for(var x = 0; x < campeonato.rounds.length; x++){
        for(var i = 0; i < campeonato.rounds[x].pairs.length; i++){
            if(campeonato.rounds[x].pairs[i].one.nome == "fantasma" || campeonato.rounds[x].pairs[i].two.nome == "fantasma"){
               campeonato.rounds[x].pairs.splice(i,1)
               }
        }
    }
}


//Criar Lista de times

function criarListaTimes(array){
    
    arrTimes = array.split("\n");
    
    if(arrTimes.length%2 != 0){
        arrTimes.push("fantasma;fantasma") // Em caso de um número ímpar de times é necessário que a cada rodada um enfrente um fantasma. 
    }
    
    for(var x = 0; x < arrTimes.length; x++){
        arrTimes[x] = arrTimes[x].split(";")
    }
}

//Criar Objetos Times

function criarObjetosTimes(array){
    for(var x = 0; x < array.length; x++){
        arrTimes[x] = new Times(x+1, array[x][0], array[x][1])
    }
}


//Algoritmo para gerar torneio
function Tournament (n) {
  this.rounds = Array()
  this.N = n
    
  for (var r=1; r<n; r++) {
    this.rounds.push (new Round(r,n))
  }
}

function Round (r, n) {
  this.pairs = Array()
  this.r = r
  this.n = n

  for (var i=1; i<=n/2; i++) {
    if (i==1) { this.pairs.push (new Pair(         1          , (r+n-i-1) % (n-1) + 2 )) }
         else { this.pairs.push (new Pair( (r+i-2) % (n-1) + 2, (r+n-i-1) % (n-1) + 2 )) }
  }
}

function Pair (one, two) {
  this.one = arrTimes[one - 1];
  this.two = arrTimes[two - 1];
}
//--------------------------------





