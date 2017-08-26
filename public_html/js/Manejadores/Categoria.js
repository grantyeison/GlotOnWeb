/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

    
    
$(document).ready(function () {
    //variables para la conexión con firebase
    var refCategorias = firebase.database().ref().child("GlotOn").child("Categoria");
    var storageRef = firebase.storage().ref().child("GlotOn");
    //variables iniciales
    var tblRestaurantes = document.getElementById("tblCategorias");
    var fichero = document.getElementById("ficheroCategoria");
    //variables auxiliares
    var accionGuardar = "guardar";
    var CategoriaEditar;
    //carga de datos que se encuentran en Firebase
    cargarRegistrosFiBa();
     //inicialización de variables listener
    fichero.addEventListener("change", subirImagen, false);
    
    $('#btnResetRest').click(function(event){
        document.getElementById("NomCateg").value = "";
        document.getElementById("UrlCateg").value = "";
        document.getElementById("EstadoCateg").value = "";
        document.getElementById("btnGuardarRest").value = "Guardar";
        accionGuardar = "guardar";
    });
    
    
    $('#btnGuardarCateg').click(function (event) {
        event.preventDefault();
        var nombre = document.getElementById("NomCateg");
        var urlImagen = document.getElementById("UrlCateg");
        var estado = document.getElementById("EstadoCateg");
        
        
        
        
        if (accionGuardar === "editar")
        {
            CategoriaEditar.update({
                cat_Nombre: nombre.value,
                cat_Imagen: urlImagen.value,
                cat_Estado: estado.value
            });
        }
        else if(accionGuardar === "guardar")
        {
            refCategorias.push({
            cat_Nombre: nombre.value,
            cat_Imagen: urlImagen.value,
            cat_Estado: estado.value
        });
        }
        
        nombre.value = "";
        urlImagen.value = "";
        estado.value = "";
        accionGuardar = "guardar";
    });
    
    
function cargarRegistrosFiBa()
{
    refCategorias.on("value", function(snap){
       var datos = snap.val();
       var filas = "";
       for (var key in datos)
       {
           filas += "<tr>" +
                        "<td>" + datos[key].cat_Nombre+ "</td>";
                if (datos[key].cat_Imagen !=="")
                {
                    filas += "<td>" + "Imagen" + "</td>";
                }
                else
                {
                    filas += "<td>" + "" + "</td>";
                }
                filas += "<td>" + datos[key].cat_Estado+ "</td>" +
                        '<td> <button class = "btn btn-danger borrar" data='+key+'> <span class=" glyphicon glyphicon-trash "></span> </button> </td>' +
                        '<td> <button class = "btn btn-info editar" data='+key+'> <span class=" glyphicon glyphicon-pencil "></span> </button> </td>' +
                        "<td></td>" +
                   "</tr>";
       }
       console.log(filas);
       tblCategorias.innerHTML = filas;
       if (filas !== "")
       {
            elementosBorrables = document.getElementsByClassName("borrar");
            elementosEditables = document.getElementsByClassName("editar");
            for (var i=0; i<elementosBorrables.length; i++)
            {
                elementosBorrables[i].addEventListener("click", borrarCategoria, false);
                elementosEditables[i].addEventListener("click", cargarCategoria, false);
            }
       }
       
    });
}


function cargarCategoria(){
    var nombre = document.getElementById("NomCateg");
    var urlImagen = document.getElementById("UrlCateg");
    var estado = document.getElementById("EstadoCateg");
    var keyBuscar = this.getAttribute("data");
    CategoriaEditar = refCategorias.child(keyBuscar);
    CategoriaEditar.once("value",function(snap){
        var datos = snap.val();
        nombre.value = datos.cat_Nombre;
        urlImagen.value = datos.cat_Imagen;
        estado.value = datos.cat_Estado;
    });
    document.getElementById("btnGuardarCateg").value = "Editar categoria";
        accionGuardar = "editar";
}

function borrarCategoria()
{
    var keyBorrar = this.getAttribute("data");
    var CategoriaBorrar = refCategorias.child(keyBorrar);
    CategoriaBorrar.remove();
    alert("Elemento eliminado");
}

function subirImagen()
{
    var nombreImagen = document.getElementById("NomCateg").value;
    if(nombreImagen === ""){
        alert("Debe asignar un nombre a la Categoria");
    }
    else
    {
        //imagen seleccionada con el input
        var imagen = fichero.files[0];
        //linea de código para subir imagen a firebase, en la carpeta "Categoria" y en su nompre propio
        var uploadTask = storageRef.child('Categoria/'+'Imagen'+'nombreImagen').put(imagen);
        var url = document.getElementById("UrlCateg");
        
        uploadTask.on('state_changed', function(snapshot){
                //barra de progreso de la subida de la imagen
              var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
              switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                  console.log('Upload is paused');
                  break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                  console.log('Upload is running');
                  break;
              }
            }, function(error) {
              // gestionar error
              alert("se ha presentado un inconveniente con el proceso de subida");
            }, function() {
              // cuando se ha subido exitosamente la imagen
              var downloadURL = uploadTask.snapshot.downloadURL;
              url.value = downloadURL;
            });
        
    }
}


});

