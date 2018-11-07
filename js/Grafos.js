//Js direcionado para a inserção e remoção de nós do grafo 

    //Criando um novo Grafo 
    var Graph = Viva.Graph.graph(); 
    //A variavel contador, será responsável pela contagem dos vértices dos grafos
    var contador = 0; 
    //Renderer é uma variavel especifica da biblioteca VivaGraphJs para renderizar o grafo na tela
    var renderer; 
    //Variavel global para determinar a direção do grafo
    var GlobalDirecional = false; 

    //Chamando função para configurar o grafo 
    //Aqui futuramente será adicionado as setas indicando origem e destino e os pesos das arestas
    ConfigurarGrafico(); 

    //Funções para manipular o grafo 
    function InserirVertice (){     //função para inserir um novo vértice

        //Insere um vértice com o Id sendo o valor do contador
        Graph.addNode(contador);
        contador++; 

        //Mostra o grafo
        renderer.run(); 
    }
    //Função para ligar um vértice ao outro
    function InserirArestas(){
        //Nessa função, o valor do vértice selecionado é lido e então todos os vértices marcados 
        //São linkados ao primeiro vértice escolhido, sendo o vértice escolhido a origem 
        var verticeSelecionado = $('#selecionar-arestas').val();
        var pesoAresta = $('#peso_aresta').val(); 

        //Lendo os valores do checkbox selecionados 
        var select = document.querySelectorAll("input[type='checkbox']:checked"),
        i = select.length,  //Le a quantidade de checkbox que foram selecionados
        arr = [];

        while (i--) {
            arr.push(select[i].value);
        }

        //Adiciona o link do vértice selecionado para cada outro marcado no checkbox
        for(var i=0; i<arr.length; i++){
            Graph.addLink(verticeSelecionado, arr[i],parseInt(pesoAresta));
        }
    }
    //Remoção de um vértice
    function RemoverVertice(){

        //Lê qual vértice foi selecionado
        var verticeARemover = $('#remover-vertice').val(); 

        //Remove o vértice e todos os links dele
        Graph.removeNode(verticeARemover);
    }
    //Remoção de uma aresta
    function RemoverAresta(){

        //Lê os dois vértices selecionados
        var primeiroVertice = $("#primeiro_vertice_aresta_remocao").val(), 
            segundoVertice = $("#segundo_vertice_aresta_remocao").val(); 

        //Remove a aresta
        Graph.forEachLinkedNode(primeiroVertice, function(linkedNode, link){
            if(linkedNode.id == segundoVertice)
                Graph.removeLink(link);
        });

    }
    //Deletar todo o grafo
    function DeletarGrafo(){
        //Deleta todos os vértices um por um
        Graph.forEachNode(function(node){
            Graph.removeNode(node.id); 
        });
        contador = 0; 
        Renderizar(); 
    }

    //Retorna o tipo de grafo (direcional ou não)
    function Direcional(){
        return GlobalDirecional;
    }

    //Apresenta em um modal um resumo do grafo
    function InformacoesGrafo(){
        var numeroVertices = contador,  //O contador possui o numero de vértice total do grafo 
            numeroArestas = 0,
            ponderado = 'Não ponderado', 
            auxDirecao; 

            Graph.forEachLink(function(link){
                numeroArestas++; 
                if(link.data != 1){ //Se qualquer aresta tiver peso != 1, ele considera o grafo ponderado!
                    ponderado = 'ponderado'; 
                }
            });

            if(numeroVertices == 0){
                $('#conteudoModalInfo').empty(); 
                $('#conteudoModalInfo').append('<div class="alert alert-warning" role="alert"> Não existe nenhum vértice </div>');
            }else {
                //Limpando o alerta
                $('#conteudoModalInfo').empty(); 

                //Info dos vértices 
                $('#numeroVertices').empty(); 
                $('#numeroVertices').append('Número vértices: ' + numeroVertices); 

                //Info das arestas 
                $('#numeroArestas').empty(); 
                $('#numeroArestas').append("Número de arestas: " + numeroArestas);

                //titulo da lista de adjacencia
                $('#tituloTabelaInfo').empty(); 
                $('#tituloTabelaInfo').append('<h1 class="text-center"> Lista de adjacências </h1>');
            if(Direcional()){
                    auxDirecao = 'direcional';
            } else auxDirecao = 'não direcional';
            //Apresenta um resumo embaixo do titulo "Lista de adjacências"
            $('#tituloTabelaInfo').append('<h5 class="text-center"> Grafo '+auxDirecao+' e '+ponderado+' </h5>');

                //Montando o head da tabela
                $('#listaAdjacenciaHead').empty(); 
                $('#listaAdjacenciaHead').append('<th> Vértice </th>');                 
                //Lista os vértices e as suas conexões 
                $('#listaAdjacenciaBody').empty(); 
                //Lista todos os vértices do grafo, e os seus vértices conectados verificando a condição de direção ou não
                Graph.forEachNode(function(node){
                    $('#listaAdjacenciaBody').append('<tr id="verticeInfo'+node.id+'"> <td> '+node.id+' </td> </tr>');
                    Graph.forEachLinkedNode(node.id.toString(),function(linkedNode,aresta){
                        if(Direcional() == false || (Direcional() == true && (node.id == aresta.fromId))){   //Verificando se é direcional ou não
                            if(ponderado === "ponderado"){
                                $('#verticeInfo'+node.id+'').append('<td> -> '+linkedNode.id+' ('+aresta.data+ ') </td>');
                            }else{
                                $('#verticeInfo'+node.id+'').append('<td> -> '+linkedNode.id+ '</td>');
                            }
                        }
                    });
                });           
            }
    }

    //Retorna se um link existe ou não entre um vértice e outro
    function ExistLink(origem, destino){

        var existencia = false; 

        Graph.forEachLinkedNode(origem, function(linkedNode,aresta){
            if(Direcional() == false || (Direcional() == true && aresta.fromId.toString() == origem)){
                if(linkedNode.id.toString() == destino){
                    existencia = true; 
                }
            }
        });

        return existencia; 
    }

    //Isso vai listar os vértices do grafo na opção de conectar vértices
    function ListarVertices (){

        //Código para manipular a página HTML
        $('#selecionar-arestas').empty(); 
        $('#lista_vertices').empty();       //Limpar os checkboxes
        $('#selecionar-arestas').append('<option selected> Selecione...</option> ')

        //Adicionando os vértices na caixa de seleção da opção "Conectar Arestas"
        Graph.forEachNode(function(node){           
            $('#selecionar-arestas').append('<option value=' + node.id + '> ' + node.id +' </option>');
        });
    }

    //Essa função vai listar os vértices que não estão conectados ao vértice origem escolhido
    //Caso o grafo for direcional a função não vai listar o vértice a qual o link for destino
    function ListarArestas(){

        //Lê o valor do vértice selecionado
        var verticeSelecionado = $('#selecionar-arestas').val(); 

        $('#lista_vertices').empty(); 

        //Vai pegar o valor selecionado no select e listar as opções de ligação do vértice
        Graph.forEachNode(function(node){
            //Vai listar se não houver o link e não for o próprio vértice selecionado
            var aux = ExistLink(verticeSelecionado.toString(),node.id.toString());
            if(node.id != verticeSelecionado &&  aux == false){
                $('#lista_vertices').append('<div class="input-group-text"> <input type="checkbox" name="arestas" value='+node.id+'> Vértice: '+ node.id+'</div>');
            }
        })

    }    

    //Vai listar os vértices para a primeira opção da remoção de aresta
    function ListarVerticeRemoverAresta(){

        //Limpando dados anterioes
        $('#primeiro_vertice_aresta_remocao').empty(); 
        $('#segundo_vertice_aresta_remocao').empty(); 

        //Mera formalidade
        $('#primeiro_vertice_aresta_remocao').append('<option selected> Selecione...</option>');

        //Listando todos os vértices do grafo
        Graph.forEachNode(function(node){
            $('#primeiro_vertice_aresta_remocao').append('<option value=' + node.id + '> ' + node.id +' </option>');
        });
    }

    //Lista todos os vértices para remoção de vértice
    function ListarRemoverVertice(){

        $('#remover-vertice').empty(); 
        $('#remover-vertice').append('<option selected> Selecione...</option> ')

        Graph.forEachNode(function(node){
            $('#remover-vertice').append('<option value=' + node.id + '> ' + node.id +' </option>')
        });
    }

    //Essa função é chamada quando o grafo é alternado de direcional para não direcional e vice-versa
    function BotaoDirecao(){

        //Altera a variavel que indica se é grafo ou dígrafo 
        //E muda o texto e a cor do botão
        if(GlobalDirecional == false){
            $('#botaoDirecao').empty(); 
            $('#botaoDirecao').append("Direcional");
            $('#botaoDirecao').attr('class','btn btn-danger');
            GlobalDirecional = true; 
        }else{
            $('#botaoDirecao').empty(); 
            $('#botaoDirecao').append("Não direcional");
            $('#botaoDirecao').attr('class','btn btn-success');
            GlobalDirecional = false;
        }
        
    }

//---------------------------------------------------------------

    //Função para criar grafos pré digitados
    function GerarGrafo(modelos){
        switch(modelos){
            case 1:{    //Grafo aleatorio
                DeletarGrafo();
                contador = 12; 
                
                for(var i=0; i<contador; i++){
                    Graph.addNode(i);
                }

                for(var i=0;i<12; i++){
                    if(i != 6)
                        Graph.addLink('6', i,1);
                        //Graph.addLink(i, 6,1);
                }
                break; }
            case 2: {   //Exemplo busca em profundidade, aula 14 no dia 03/10
                DeletarGrafo();
                contador = 6; 
                for(var i=0; i<contador; i++){
                    Graph.addNode(i); 
                }

                //Saindo de 0 
                Graph.addLink('0','1',1); 
                Graph.addLink('0','2',1); 
                Graph.addLink('0','5',1); 
                Graph.addLink('0','3',1); 

                //Saindo de 1 
                Graph.addLink('1','2',1); 
                Graph.addLink('1','3',1); 

                //Saindo de 2 
                Graph.addLink('2','3',1); 
                Graph.addLink('2','5',1); 

                //Saindo de 3 
                Graph.addLink('3','5',1); 
                Graph.addLink('3','4',1); 

                //Saindo de 4
                Graph.addLink('4','5',1); 

                
                
                break; }
            case 3: {   //Exemplo busca em largura do dia 03/10 e Dijkstra do dia 16/10
                DeletarGrafo(); 
                contador = 6;
                for(var i=0; i<contador; i++){
                    Graph.addNode(i);
                }

                //Gerando os links do vértice 1
                Graph.addLink('0','1',2);
                Graph.addLink('0','5',7);
                //Gerando os links do vértice 2
                Graph.addLink('1','2',9);
                Graph.addLink('1','4',3);
                Graph.addLink('1','5',4);
                //Gerando os links do vértice 3
                Graph.addLink('2','3',5);
                Graph.addLink('2','4',4);
                Graph.addLink('2','5',3);
                //Gerando os links do vértice 4
                Graph.addLink('3','4',3);
                //Gerando os links do vértice 5
                Graph.addLink('4','5',1);
                break; }
            case 4:{    //Exemplo de Ordenação Topologica do dia 24/10 (1° Exemplo)
                DeletarGrafo(); 
                contador = 9; 
                for(var i=0; i<contador; i++){
                    Graph.addNode(i);
                }

                //Conexão do vértice a do exemplo em sala de aula
                Graph.addLink('0','1',1);
                Graph.addLink('0','2',1);
                Graph.addLink('0','4',1);

                //Conexão do vértice b do exemplo em sala de aula
                Graph.addLink('1','3',1);
                Graph.addLink('1','4',1);

                //Conexão do vértice c do exemplo em sala de aula
                Graph.addLink('2','5',1);
                Graph.addLink('2','7',1);

                //Conexão do vértice d do exemplo em sala de aula
                Graph.addLink('3','6',1);

                //Conexão do vértice e do exemplo em sala de aula
                Graph.addLink('4','6',1);
                Graph.addLink('4','8',1);
                Graph.addLink('4','7',1);

                //Conexão do vértice f do exemplo em sala de aula
                Graph.addLink('5','7',1);

                //Conexão do vértice g do exemplo em sala de aula
                Graph.addLink('6','8',1);

                //Conexão do vértice h do exemplo em sala de aula
                Graph.addLink('7','8',1);
                break; }
            case 5:{    //Exemplo de Ordenação Topologica do dia 24/10 (2° Exemplo)
                DeletarGrafo(); 
                contador = 10;
                for(var i=0; i<contador; i++){
                    Graph.addNode(i); 
                }

                //Conexões do vértice 0 
                Graph.addLink('0','1',1); 
                Graph.addLink('0','2',2); 
                Graph.addLink('0','3',3);
                Graph.addLink('0','5',4); 

                //Conexões do vértice 1 
                Graph.addLink('1','2',5); 

                //Conexões do vértice 2
                Graph.addLink('2','3',6);
                Graph.addLink('2','4',7);
                
                //Conexões do vértice 4
                Graph.addLink('4','6',2); 

                //Conexões do vértice 5 
                Graph.addLink('5','6',3); 
                Graph.addLink('5','4',6); 

                //Conexões do vértice 6
                Graph.addLink('6','8',2); 
                Graph.addLink('6','7',5); 

                //Conexões do vértice 7
                Graph.addLink('7','8',8);           
                
                //Conexões do vértice 9
                Graph.addLink('9','6',9);   
                break; }
        }
        Renderizar(); 
    }

//---------------------------------------------------------------
    // CONFIGURAÇÃO VISUAL DO GRAFO 
    function ConfigurarGrafico(){
        var svgGraphics = Viva.Graph.View.svgGraphics(),
        nodeSize = 24;
        svgGraphics.node(function(node){
            //var groupId = node.data.group;
            //node.addLabel('Teste');
            var ui = Viva.Graph.svg('g'),
                legenda = Viva.Graph.svg('text').attr('y', '-20px').text(node.id),
                circle = Viva.Graph.svg('circle')
                .attr('r', nodeSize/2)
                .attr('stroke', '#ccc')
                .attr('stroke-width', '1.5px');

            //circle.append('title').text('teste');
            ui.append(legenda); 
            ui.append(circle); 

            return ui; 

        }).placeNode(function(nodeUI, pos){
            nodeUI.attr('transform','translate(' +
                                  (pos.x - nodeSize/4) + ',' + (pos.y - nodeSize/4) +
                            ')');
        });

        renderer = Viva.Graph.View.renderer(Graph, {
            container : document.getElementById('display-canvas'),
            graphics: svgGraphics      
        });        
    }
    
    //SEMPRE QUE O GRÁFICO PRECISAR SER ATUALIZADO, CHAMAR ESSA FUNÇÃO 
    function Renderizar(){
        renderer.run(); 
    }

    //EVENTOS 
    //Quando o primeiro vértice for selecionado para conectar as arestas
    //Então é listado os outros vértices para que possa ser feita a conexão 
    $("#selecionar-arestas").on('change', function(){ 
        ListarArestas(); 
    });

    //Mesmo principio que o evento anterior, porém a ação estão sendo aqui dentro 
    //do evento, e não através da chamada de uma função
    $("#primeiro_vertice_aresta_remocao").on('change', function(){ 
        
        var primeiroVertice = $("#primeiro_vertice_aresta_remocao").val(); 

        $('#segundo_vertice_aresta_remocao').empty();
        $('#segundo_vertice_aresta_remocao').append('<option selected> Selecione...</option>');

        Graph.forEachLinkedNode(primeiroVertice, function(linkedNode, link){
            if(linkedNode.id != primeiroVertice)
                $('#segundo_vertice_aresta_remocao').append('<option value=' + linkedNode.id + '> ' + linkedNode.id +' </option>');   
        });  
    });

    //Função para o Menu Lateral funcionar
    $(document).ready(function () {
        $('#sidebarCollapse').on('click', function () {
            $('#sidebar').toggleClass('active');
        });
    });