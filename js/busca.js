// ---------------------------------------------------------------
    //Funções para a buscar no Grafo
    
    //Variaveis globais 
    //var verticeInicial; 

    var ContLinks = 0; 
    var Links = [];

    function InicialBusca(tipoBusca){
        var numeroVertices = 0;
        Graph.forEachNode(function(node){
            numeroVertices++; 
        });
        switch(tipoBusca){
            case 1: //listando os vértices no modal da busca em profundidade
                $('#listaIniciaProfundidade').empty(); 
                Graph.forEachNode(function(node){
                    $('#listaIniciaProfundidade').append('<option value=' + node.id + '> ' + node.id +' </option>');
                });
                break; 
            case 2:     //Listando os vértices no modal da busca em largura 
                $('#listaIniciaLargura').empty(); 
                Graph.forEachNode(function(node){
                    $('#listaIniciaLargura').append('<option value=' + node.id + '> ' + node.id +' </option>');
                });
                break; 
            case 3:                 
                if(numeroVertices != 0){
                    $('#aviso').empty(); 
                    $('#listaIniciaDijkstra').empty(); 
                    Graph.forEachNode(function(node){
                        $('#listaIniciaDijkstra').append('<option value=' + node.id + '> ' + node.id +' </option>');
                    });
                }else{
                    $('#aviso').empty(); 
                    $("#aviso").append('<div class="alert alert-warning" role="alert"> Não existe grafo! </div>');
                }
                break; 
            case 4: 
            $('#aviso_ordenacao').empty(); 
            $('#aviso_ordenacao').empty(); 
                if(numeroVertices != 0){
                    if(Direcional()){
                        Graph.forEachNode(function(node){
                            $('#listaIniciaOrdenacao').append('<option value=' + node.id + '> ' + node.id +' </option>');
                        });          
                    }else {                        
                        $("#aviso_ordenacao").append('<div class="alert alert-warning" role="alert"> O grafo precisa ser direcional! </div>');
                    }
                }else {                    
                    $("#aviso_ordenacao").append('<div class="alert alert-warning" role="alert"> Não existe grafo! </div>');
                }
                
                break; 
        }
    }

    //Funções para a busca em profundidade
    function BuscaEmProfundidade(){

        Limpar(); 

        var verticeInicial = $('#listaIniciaProfundidade').val(); 
        var vetorMarcacao = []; 
        var cont = 0;
        ContLinks = 0; 
        Links = [];

        //Conta a quantidade de vértices: 
        Graph.forEachNode(function(node){
            cont++; 
        });

        //Zerando o vetor cont(|v|) vezes 
        for(var i=0; i<cont; i++){
            vetorMarcacao[i] = 0;
        }
        //Realizar a varredura dos vértices recursivamente
        RecursaoProfundidade(verticeInicial,vetorMarcacao); 

        //Apresenta o resultado na tela da busca em profundidade
        ResultadoNaTela(Links, 'Profundidade',0);
    }

    function RecursaoProfundidade(vertice, vetor){

        //Marcando o vértice atual
        vetor[vertice] = 1; 

        Graph.forEachLinkedNode(vertice , function(VerticeConectado,aresta){
            if(vetor[VerticeConectado.id] == 0){
                //Se não for direcional ele executa normalmente
                //Se for direcional ele só entra se o vértice atual for a origem do link
                if(Direcional() == false || (Direcional() == true && (aresta.fromId == vertice))){ 
                        Links[ContLinks] = {
                        "fromId": vertice, 
                        "toId":VerticeConectado.id
                    }; 
                    ContLinks++; 
                    
                    RecursaoProfundidade(VerticeConectado.id.toString(),vetor,contador);
                }
            }
        });
    }

    //Funções para a busca em largura
    function BuscaEmLargura(){ 

        var verticeInicial = $('#listaIniciaLargura').val();
        var vetorMarcacao = []; 
        var vetorDist = [];
        var cont = ContLinks = 0; 
        var fila = new Queue();     //Fila
        Links = []; 
        
        Limpar();

        Graph.forEachNode(function(node){
            cont++; 
        });

        //Zerando o vetor |v| vezes
        for(var i=0; i<cont; i++){
            vetorDist[i] = Infinity;
            vetorMarcacao[i] = 0; 
        }

        vetorDist[verticeInicial] = 0; 
        RecursaoLargura(verticeInicial, vetorMarcacao, vetorDist, fila);

        ResultadoNaTela(Links, 'Largura', vetorDist);
    }

    function RecursaoLargura(vertice, vetorMarcacao, vetorDist,fila){
        
        vetorMarcacao[vertice] = 1; //Marcando o vértice atual 
        Graph.forEachLinkedNode(vertice, function(verticeLinkado, aresta){
            if(vetorMarcacao[verticeLinkado.id] == 0){
                //Se não for direcional ele executa normalmente
                //Se for direcional ele só entra se o vértice atual for a origem do link
                if(Direcional() == false || (Direcional() == true && (aresta.fromId == vertice))){
                    //Marcando o caminho dos vértices
                    Links[ContLinks] = {
                        "fromId": vertice,
                        "toId": verticeLinkado.id
                    };
                    ContLinks++; 
                    //Cálculo da distancia
                    nova_distancia = vetorDist[vertice] + aresta.data;               
                    if(nova_distancia < vetorDist[verticeLinkado.id])
                        vetorDist[verticeLinkado.id] = nova_distancia;    

                    //Marcação e enfileira 
                    vetorMarcacao[verticeLinkado.id] = 1; 
                    fila.enqueue(verticeLinkado.id.toString());
                }
            }        
        });

        var auxiliar = fila.dequeue();

        if(auxiliar != undefined){
            RecursaoLargura(auxiliar,vetorMarcacao,vetorDist,fila);
        }
    }

    function Dijkstra(){
        var verticeInicial = $('#listaIniciaDijkstra').val(),
            lista = new List(contador), 
            vetorMarcacao = [], 
            vetorDistancia = []; 

        //Zerando 
        Links = [];
        ContLinks = 0; 

        LimparDijkstra(); 

        //Preenchendo os vetores auxiliares 
        for(var i=0; i<contador; i++){
            vetorMarcacao[i] = 0; 
            vetorDistancia[i] = Infinity; 
        }

        //Adicionando os elementos na lista 
        Graph.forEachNode(function(node){
            lista.Add(node.id); 
        });       

        //Zerando a primeira distancia
        vetorDistancia[verticeInicial] = 0; 
        RecursaoDijkstra(verticeInicial.toString(), vetorMarcacao, vetorDistancia, lista);

        ResultadoDijkstra(Links, vetorDistancia); 
    }

    function RecursaoDijkstra(vertice, Marcacao, dist, lista){

        //console.log('Vértice atual: ' + vertice); 
        Marcacao[vertice] = 1; 

        var menorDist = {
            'toId': null, 
            'peso': Infinity
        }; 

        if(lista.Count() !== 0){
            lista.RemoveAt(vertice);

            Graph.forEachLinkedNode(vertice,function(linkedNode,aresta){
                //console.log("Vértice linkado: " + linkedNode.id + " peso: " + aresta.data);  

                if(Direcional() == false || (Direcional() == true && aresta.fromId == vertice)){
                    //Distancia
                    nova_distancia = dist[vertice] + aresta.data;               
                    if(nova_distancia < dist[linkedNode.id])
                        dist[linkedNode.id] = nova_distancia;
                        
                    if(Marcacao[linkedNode.id] == 0){
                        
                        

                        if(aresta.data < menorDist.peso){
                            menorDist.toId = linkedNode.id; 
                            menorDist.peso = aresta.data;
                        }
                    }                    
                }
            });

            if(menorDist.toId != null){
                Links[ContLinks] = {
                    'fromId': vertice, 
                    'toId': menorDist.toId.toString(),
                    'peso': menorDist.peso
                }
                ContLinks++; 
                RecursaoDijkstra(menorDist.toId.toString(), Marcacao,dist,lista);   
            }
                
        }       
    }

    //Função para mostrar os resultados da busca nos modals de cada tipo de busca
    function ResultadoNaTela(vetorDeLinks,tipoDeBusca,vetDist){

        $('#thead_'+tipoDeBusca+'').append('<tr> <th> Passagem </th> <th> Do vértice </th> <th> Para o vértice </th> </tr>')
        for(var i=0; i<vetorDeLinks.length; i++){
            if(i == 0)
                $('#tbody_'+tipoDeBusca+'').append('<tr> <th scope="row"> '+(i+1)+'</th> <td> '+vetorDeLinks[i].fromId +'[V<sub>0</sub>]</td> <td> '+ vetorDeLinks[i].toId +'</td> </tr>');
            else $('#tbody_'+tipoDeBusca+'').append('<tr> <th scope="row"> '+(i+1)+'</th> <td> '+vetorDeLinks[i].fromId +'</td> <td> '+ vetorDeLinks[i].toId +'</td> </tr>');
        }
        for(var i=0; i<vetorDeLinks.length; i++){
            if(i == 0)
                $('#alert'+tipoDeBusca+'Ordem').append(' ('+vetorDeLinks[i].fromId+'[V<sub>0</sub>]->'+vetorDeLinks[i].toId+')');
            else{
                $('#alert'+tipoDeBusca+'Ordem').append(' ('+vetorDeLinks[i].fromId+'->'+vetorDeLinks[i].toId+')');
                if(i != vetorDeLinks.length-1)
                    $('#alert'+tipoDeBusca+'Ordem').append(',');
            }
        }               

        $('#alert'+tipoDeBusca+'Ordem').append(' Fim! Todos os vértices visitados!');

        if(tipoDeBusca == 'Largura'){ //Vetor distância
            $('#thead_Largura_dist').append('<tr>');
            for(var i=0; i<vetDist.length; i++){
                if(i == 0){
                    $('#thead_Largura_dist').append('<th> Vértice: </th>');
                }
                $('#thead_Largura_dist').append('<th> '+ i + ' </th>');
            }
            $('#thead_Largura_dist').append('</tr>');

            $('#tbody_Largura_dist').append('<tr>');
            for(var i=0; i<vetDist.length; i++){
                if(i == 0){
                    $('#tbody_Largura_dist').append('<td> Distância: </td>');
                }
                $('#tbody_Largura_dist').append('<td>'+vetDist[i]+' </td>');
            }
            $('#tbody_Largura_dist').append('</tr>');
        }
    }

    function ResultadoDijkstra(vetorDeLinks,vetDist){

        LimparDijkstra();

        $('#thead_dijkstra').append('<tr> <th> Passagem </th> <th> Do vértice </th> <th> Para o vértice </th> </tr>');
        for(var i=0; i<vetorDeLinks.length; i++){
            if(i==0)
                $('#tbody_dijkstra').append('<tr> <td> '+ (i+1) +'</td> <td> '+ vetorDeLinks[i].fromId + ' (V<sub>0</sub>) </td> <td> '+ vetorDeLinks[i].toId +'('+ vetorDeLinks[i].peso+ ')  </td> </tr>')
            else $('#tbody_dijkstra').append('<tr> <td> '+ (i+1) +'</td> <td> '+ vetorDeLinks[i].fromId + ' </td> <td> '+ vetorDeLinks[i].toId +'('+ vetorDeLinks[i].peso+ ')  </td> </tr>')
        }

        $('#titulo-dist').empty(); 
        $('#titulo-dist').append('Vetor distancia');

        $('#thead_dijkstra_dist').append('<tr>');
        for(var i=0; i<vetDist.length; i++){
            if(i==0){
                $('#thead_dijkstra_dist').append('<th> Vértice </th>');
            }
            $('#thead_dijkstra_dist').append('<th> '+ i +' </th>');
        }
        $('#thead_dijkstra_dist').append('</tr>');

        //Os dados
        $('tbody_dijkstra_dist').append('<td>');
        for(var i=0; i<vetDist.length; i++){
            if(i==0){
                $('#tbody_dijkstra_dist').append('<th> Distância </th>');
            }
            $('#tbody_dijkstra_dist').append('<td> '+ vetDist[i] +' </td>');
        }
        $('tbody_dijkstra_dist').append('</td>');



    }

    function Limpar(){
        //Limpando busca em profundidade 
        $('#alertProfundidadeOrdem').empty();
        $('#alertProfundidadeOrdem').append('Ordem de visita: ');

        $('#thead_Profundidade').empty(); 
        $('#tbody_Profundidade').empty(); 

        //Limpando busca em largura
        $('#alertLarguraOrdem').empty();
        $('#alertLarguraOrdem').append('Ordem de visita: ');

        $('#thead_Largura').empty(); 
        $('#tbody_Largura').empty(); 

        $('#thead_Largura_dist').empty(); 
        $('#tbody_Largura_dist').empty(); 
    }

    function LimparDijkstra(){
        
        $('#thead_dijkstra').empty(); 
        $('#tbody_dijkstra').empty(); 

        $('#thead_dijkstra_dist').empty(); 
        $('#tbody_dijkstra_dist').empty(); 
    }
    function MostrarLinks(){
        console.dir(Links);
    }    

    function OrdenacaoTopologica(){
        console.log("Ordenacao topologica"); 
        if(Direcional()){
            console.log("Direcional, começando algoritmo"); 

            //Marcar a quantidade de arestas que chegam no nó 

        }else {
            console.log("não direcional, faz nada"); 
        }
    }

