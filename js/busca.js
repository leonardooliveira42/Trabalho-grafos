// ---------------------------------------------------------------
    //Funções para a buscar no Grafo
    
    //Variaveis globais 
    //var verticeInicial; 

    var ContLinks = 0; 
    var Links = [];
    var vetorOrdenacaoTopologica = [];

    function InicialBusca(tipoBusca){
        var numeroVertices = 0;
        Graph.forEachNode(function(node){
            numeroVertices++; 
        });
        switch(tipoBusca){
            case 1:{            //listando os vértices no modal da busca em profundidade
                $('#listaIniciaProfundidade').empty(); 
                Graph.forEachNode(function(node){
                    $('#listaIniciaProfundidade').append('<option value=' + node.id + '> ' + node.id +' </option>');
                });
                break; }
            case 2:{            //Listando os vértices no modal da busca em largura 
                $('#listaIniciaLargura').empty(); 
                Graph.forEachNode(function(node){
                    $('#listaIniciaLargura').append('<option value=' + node.id + '> ' + node.id +' </option>');
                });
                break; }
            case 3:{            //Listando os vértices no modal do algoritmo Dijkstra
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
                break; }
            case 4:{            //Listando os vértices que possuem 0 arestas chegando neles, no modal da Ordenação Topológica
                LimparOrdenacao();  
                if(numeroVertices != 0){
                    var ciclagem = true; 
                    if(Direcional()){
                        //Aqui será marcado o quanto de arestas que chegam em cada vértice 
                        
                        MarcandoArestasDosVertices(); 

                        console.log(vetorOrdenacaoTopologica);

                        $('#listaIniciaOrdenacao').empty();   
                        $('#vetorVerticesOrdenacaoInfo').empty(); 
                        $('#vetorOrdenacaoInfo').empty();                       

                        for(var i=0; i<contador;  i++){
                            if(i == 0 )
                                $('#vetorVerticesOrdenacaoInfo').append('<th> Vértice: </th>')
                            $('#vetorVerticesOrdenacaoInfo').append('<th>'+ i + '</th>')
                        }
                        for(var i=0; i<vetorOrdenacaoTopologica.length; i++){
                            if(i == 0){
                                $('#vetorOrdenacaoInfo').append('<th> |A| que chegam: </th>');

                            }
                            $('#vetorOrdenacaoInfo').append('<td> ' + vetorOrdenacaoTopologica[i] +' </td>')
                            if(vetorOrdenacaoTopologica[i] == 0){
                                ciclagem = false; 
                                $('#listaIniciaOrdenacao').append('<option value=' + i + '> ' + i +' </option>');
                            }   
                               
                        }
                        
                        if(ciclagem == true){
                            $("#aviso_ordenacao").append('<div class="alert alert-danger" role="alert"> O grafo cicla! Não é possível realizar a ordenação topologica </div>');
                        }
                        
                                
                    }else {                        
                        $("#aviso_ordenacao").append('<div class="alert alert-warning" role="alert"> O grafo precisa ser direcional! </div>');
                    }
                }else {                    
                    $("#aviso_ordenacao").append('<div class="alert alert-warning" role="alert"> Não existe grafo! </div>');
                }
                
                break; }
        }
    }

    //Funções para a busca em profundidade
    function BuscaEmProfundidade(){
        //Entra nessa função quando o botão Iniciar for apertado na busca em profundidade
        Limpar(); 

        //Lê qual foi o vértice selecionado para começar a busca
        var verticeInicial = $('#listaIniciaProfundidade').val(); 
        var vetorMarcacao = [];     //Cria um vetor para marcar qual vértice já foi visitado
        var cont = 0;               //Variavel para contar a quantidade de vértices no grafo
        ContLinks = 0;              //Zerando variavel global, iterador do vetor Links
        Links = [];                 //Vetor Links, que grava a origem e destino de certa passagem do tipo de busca

        //Conta a quantidade de vértices: 
        Graph.forEachNode(function(node){
            cont++; 
        });

        //Zerando o vetor marcacao (|v|) vezes 
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
            //Só executa o conteúdo do if se o vértice linkado não estiver marcado
            if(vetor[VerticeConectado.id] == 0){
                //Se não for direcional ele executa normalmente
                //Se for direcional ele só entra se o vértice atual for a origem do link
                if(Direcional() == false || (Direcional() == true && (aresta.fromId == vertice))){ 
                    //Salva a passagem do vértice atual para o próximo vértice
                    Links[ContLinks] = {
                        "fromId": vertice, 
                        "toId":VerticeConectado.id
                    }; 
                    ContLinks++; //Incrementa no iterador do vetor Links
                    
                    //Chama a função novamente com o vértice destino como vértice inicial 
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

    //Funções para Dijkstra
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

    //Funções para Ordenação topologica
    function OrdenacaoTopologica(){
        if(Direcional()){
            var verticeInicial = $('#listaIniciaOrdenacao').val(), 
                vetorMarcacao = []; 

                Links = []; 
                ContLinks = 0; 

                for(var i=0; i<contador; i++){
                    vetorMarcacao[i] = 0; 
                }

                MarcandoArestasDosVertices(); 

                Links[ContLinks] = {
                    'fromId': 'ponta', 
                    'toId': verticeInicial
                };
                ContLinks++; 
                RecursaoOrdenacao(verticeInicial,vetorMarcacao);

                for(var i=0; i<contador; i++){
                    if(vetorMarcacao[i] == 0){
                        if(vetorOrdenacaoTopologica[i] == 0){
                            Links[ContLinks] = {
                                'fromId': 'ponta', 
                                'toId': i
                            };
                            ContLinks++; 
                            RecursaoOrdenacao(i,vetorMarcacao);
                        }
                    }
                }                
                ResultadoNaTelaOrdenacao(); 

        }else {
            $('#aviso_ordenacao_comeco').empty(); 
            $('#aviso_ordenacao_comeco').append('<div class="alert alert-warning" role="alert"> Não é possível começar a Ordenação! </div>');
        }
    }

    function RecursaoOrdenacao(vertice, vetorMarcacao){

        //Marcando o vértice atual 
        vetorMarcacao[vertice] = 1; 

        Graph.forEachLinkedNode(vertice.toString(), function(linkedNode, aresta){
            if(aresta.toId == linkedNode.id){
                vetorOrdenacaoTopologica[linkedNode.id]--; 
            }
        });

        Graph.forEachLinkedNode(vertice.toString(), function(linkedNode, aresta){
            if(vetorOrdenacaoTopologica[linkedNode.id] == 0 && vetorMarcacao[linkedNode.id] == 0){
                Links[ContLinks] = {
                    'fromId': vertice, 
                    'toId': linkedNode.id
                };
                ContLinks++; 
                RecursaoOrdenacao(linkedNode.id,vetorMarcacao);
            }
        });
    }

    function ResultadoNaTelaOrdenacao(){

        //Limpar resultados
        $('#ResultadosOrdenacao').empty(); 
        $('#thead_ordenacao').empty(); 
        $('#tbody_ordenacao').empty(); 

        //Escrever os dados
        $('#ResultadosOrdenacao').append("Passagens"); 

        $('#thead_ordenacao').append('<tr> <th> Passagem </th> <th> De: </th> <th> Para: </th> </tr> ');

        for(var i=0; i<Links.length; i++){
            $('#tbody_ordenacao').append('<tr>');
            $('#tbody_ordenacao').append('<th> '+i+'</th> <td> '+ Links[i].fromId +' </td> <td> '+ Links[i].toId + '</td>');
            $('#tbody_ordenacao').append('</tr>');
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

    function LimparOrdenacao(){
        $('#aviso_ordenacao').empty(); 
        $('#aviso_ordenacao_comeco').empty(); 
        $('#vetorVerticesOrdenacaoInfo').empty(); 
        $('#vetorOrdenacaoInfo').empty();  
        $('#ResultadosOrdenacao').empty(); 
        $('#thead_ordenacao').empty(); 
        $('#tbody_ordenacao').empty();         
    }


    function MarcandoArestasDosVertices(){

        for(var i=0; i<contador; i++){
            vetorOrdenacaoTopologica[i] = 0; 
        }

        Graph.forEachNode(function(node){
            Graph.forEachLinkedNode(node.id.toString(),function(linkedNode, link){
                if(node.id == link.toId){
                    vetorOrdenacaoTopologica[node.id]++; 
                }
            });
        });
    }
    

