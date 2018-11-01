//Js direcionado para a inserção e remoção de nós do grafo 

    //Criando um novo Grafo 
    var Graph = Viva.Graph.graph(); 
    var contador = 0; //Será os ids de cada vértice 
    var renderer; 

    //Chamando função para configurar o grafo 
    ConfigurarGrafico(); 

    //Funções para manipular o grafo 
    function InserirVertice (){     //função para inserir um novo vértice

        Graph.addNode(contador);
        contador++; 

        renderer.run(); 
    }

    function ListarVertices (){

        $('#selecionar-arestas').empty(); 
        $('#lista_vertices').empty();       //Limpar os checkboxes
        $('#selecionar-arestas').append('<option selected> Selecione...</option> ')

        Graph.forEachNode(function(node){
           
            $('#selecionar-arestas').append('<option value=' + node.id + '> ' + node.id +' </option>');
        });
    }

    function ListarArestas(){

        //console.log("listando arestas");
        //Vértice Selecionado
        var verticeSelecionado = $('#selecionar-arestas').val(); 
        //console.log("Vertice selecionado: "+verticeSelecionado);

        $('#lista_vertices').empty(); 

        //Vai pegar o valor selecionado no select e listar as opções de ligação do vértice
        Graph.forEachNode(function(node){
            if(node.id != verticeSelecionado)
                $('#lista_vertices').append('<div class="input-group-text"> <input type="checkbox" name="arestas" value='+node.id+'> Vértice: '+ node.id+'</div>');
        })

    }

    function InserirArestas(){
        //console.log("Inserindo as arestas");

        var verticeSelecionado = $('#selecionar-arestas').val();
        var pesoAresta = $('#peso_aresta').val(); 

        //Lendo os valores do checkbox selecionados 
        var select = document.querySelectorAll("input[type='checkbox']:checked"),
        i = select.length,
        arr = [];

        while (i--) {
            arr.push(select[i].value);
        }

        for(var i=0; i<arr.length; i++){
            Graph.addLink(verticeSelecionado, arr[i],parseInt(pesoAresta));
            //Graph.addLink(arr[i],verticeSelecionado);
        }
        //console.log("Vetor seleção: " + arr);
    }

    function DeletarGrafo(){
        Graph.forEachNode(function(node){
            Graph.removeNode(node.id); 
        });
        contador = 0; 
        Renderizar(); 

    }

    function ListarVerticeRemoverAresta(){

        $('#primeiro_vertice_aresta_remocao').empty(); 
        $('#segundo_vertice_aresta_remocao').empty(); 

        $('#primeiro_vertice_aresta_remocao').append('<option selected> Selecione...</option>');

        Graph.forEachNode(function(node){
            $('#primeiro_vertice_aresta_remocao').append('<option value=' + node.id + '> ' + node.id +' </option>');
        });
    }

    function RemoverAresta(){

        var primeiroVertice = $("#primeiro_vertice_aresta_remocao").val(), 
            segundoVertice = $("#segundo_vertice_aresta_remocao").val(); 

        Graph.forEachLinkedNode(primeiroVertice, function(linkedNode, link){
            if(linkedNode.id == segundoVertice)
                Graph.removeLink(link);
        });

    }

    function ListarRemoverVertice(){

        $('#remover-vertice').empty(); 
        //$('#lista_vertices').empty();       //Limpar os checkboxes
        $('#remover-vertice').append('<option selected> Selecione...</option> ')

        Graph.forEachNode(function(node){
            $('#remover-vertice').append('<option value=' + node.id + '> ' + node.id +' </option>')
        });
    }

    function RemoverVertice(){

        var verticeARemover = $('#remover-vertice').val(); 

        Graph.removeNode(verticeARemover);
        //console.log(verticeARemover);
    }

//---------------------------------------------------------------

    //Função para criar grafos pré digitados
    function GerarGrafo(modelos){
        switch(modelos){
            case 1: 
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
                break; 
            case 2: 
                //Graph = Viva.Graph.graph(); 
                DeletarGrafo();
                contador = 7; 
                for(var i=0; i<contador; i++){
                    Graph.addNode(i); 
                }

                for(var i=0; i<6; i++){
                    Graph.addLink('0',i+1,1); 
                    //Graph.addLink(i+1,'0');
                }
                
                break; 
            case 3: //Exemplo da sala de aula 
                DeletarGrafo(); 
                contador = 6;
                for(var i=0; i<contador; i++){
                    Graph.addNode(i);
                }

                //Gerando os links do vértice 1
                Graph.addLink('0','1',1);
                Graph.addLink('0','5',1);
                //Gerando os links do vértice 2
                Graph.addLink('1','2',1);
                Graph.addLink('1','4',1);
                Graph.addLink('1','5',1);
                //Gerando os links do vértice 3
                Graph.addLink('2','3',1);
                Graph.addLink('2','4',1);
                Graph.addLink('2','5',1);
                //Gerando os links do vértice 4
                Graph.addLink('3','4',1);
                //Gerando os links do vértice 5
                Graph.addLink('4','5',1);
            break; 
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
    $("#selecionar-arestas").on('change', function(){ 
        ListarArestas(); 
    });

    $("#primeiro_vertice_aresta_remocao").on('change', function(){ 
        
        var primeiroVertice = $("#primeiro_vertice_aresta_remocao").val(); 

        $('#segundo_vertice_aresta_remocao').empty();
        $('#segundo_vertice_aresta_remocao').append('<option selected> Selecione...</option>');

        Graph.forEachLinkedNode(primeiroVertice, function(linkedNode, link){
            if(linkedNode.id != primeiroVertice)
                $('#segundo_vertice_aresta_remocao').append('<option value=' + linkedNode.id + '> ' + linkedNode.id +' </option>');   
        });  
    });


