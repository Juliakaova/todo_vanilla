class Tarea{
    constructor(id,texto,estado,contenedor){//número, string, boolean, DOM
        this.id= id;
        this.texto=texto;
        this.DOM=null; //representa el htnl que tiene que pintar
        this.editando= false; // en que punto está la tarea

        this.crearDOM(estado,contenedor)
    }
    crearDOM(estado,contenedor){
        this.DOM = document.createElement("div");
        this.DOM.classList.add("tarea");

        //texto tarea
        let textoTarea = document.createElement("h2");
        textoTarea.innerText = this.texto;
        textoTarea.classList.add("visible");

        //editor tarea
        let editorTarea = document.createElement("input");
        editorTarea.setAttribute("type","text");//(qué quieres introducir, el valor qué le das)
        editorTarea.value = this.texto;

        //boton editar
        let botonEditar = document. createElement("button");
        botonEditar.classList.add("boton");
        botonEditar.innerText= "editar";

        botonEditar.addEventListener("click", () => this.actualizarTexto());

        //boton borrar
        let botonBorrar = document. createElement("button");
        botonBorrar.classList.add("boton");
        botonBorrar.innerText= "borrar";

        botonBorrar.addEventListener("click", () => this.borrarTarea());

        //boton estado
        let botonEstado = document.createElement("button");
        botonEstado.className = `estado ${estado ? "terminado" : ""}`;//true : false
        botonEstado.appendChild(document.createElement("span"));

        botonEstado.addEventListener("click", () => {
            this.actualizarEstado()
            .then(() => botonEstado.classList.toggle("terminada"))
            .catch(()=> console.log("error actualizando estado"))
        });

        this.DOM.appendChild(textoTarea);
        this.DOM.appendChild(editorTarea);
        this.DOM.appendChild(botonEditar);
        this.DOM.appendChild(botonBorrar);
        this.DOM.appendChild(botonEstado);
        contenedor.appendChild(this.DOM);

    }
    borrarTarea(){//esto es un método
        fetch("https://api-todo-nvvq.onrender.com/tareas/borrar/" + this.id,{ // this hace referencia al futuro objeto que crees
            method: "DELETE"
        })
       
        .then(({status})=>{
            if(status == 204){
                return this.DOM.remove();
            }
            console.log("error eliminando tarea");
        });
    }
   actualizarEstado(){//otro método
       return new Promise((ok,ko) => {
            fetch("https://api-todo-nvvq.onrender.com/tareas/actualizar/estado/" +this.id, {
                method: "PUT"
            })
            .then(({status})=>{
                if(status == 204){
                    return ok();
                }
                ko();
            });
       });
    }
    async actualizarTexto(){
        if(this.editando){
            let tareaTemporal = this.DOM.children[1].value.trim();

            if(tareaTemporal != "" && tareaTemporal != this.texto){

                let {status}= await fetch("https://api-todo-nvvq.onrender.com/tareas/actualizar/texto/"+this.id, {
                    method: "PUT",
                    body: JSON.stringify({tarea:tareaTemporal}),
                    headers:{
                        "Content-type" : "application/json"
                    }
                })
                
                if(status ==204){
                    this.texto= tareaTemporal;
                }else{
                    console.log("error actualizando el texto");
                }
            }

            //quitar clase visible a editorTarea
            this.DOM.children[1].classList.remove("visible");
            //actualizar el innerText de textoTarea al último this.texto
            this.DOM.children[0].innerText= this.texto;
            //añadir clase visible a textoTarea
            this.DOM.children[0].classList.add("visible");
            //cambiar texto botonEditar
            this.DOM.children[2].innerText= "editar";


        }else{
            //quitar clase visible a textoTarea
            this.DOM.children[0].classList.remove("visible");
            //actualizar el value de editorTexto al último this.texto
            this.DOM.children[1].value = this.texto;
            //añadir clase visible a editorTexto
            this.DOM.children[1].classList.add("visible");
            //cambiar texto botonEditar
            this.DOM.children[2].innerText= "guardar";
        }
        this.editando = !this.editando;
    }

}