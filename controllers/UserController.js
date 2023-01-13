class UserController{

        constructor(formIdCreate,formIdUpdate ,tableId){
            this.formEl = document.getElementById(formIdCreate);//possui o ID do form passado no construtor no new
            this.formUpdateEl = document.getElementById(formIdUpdate);
            this.tableEl = document.getElementById(tableId);//possui o ID do table passado no construtor no new
            this.onSubmit();  
            this.onEdit();    
        }

        //method
        onEdit(){
                document.querySelector("#box-user-update .btn-cancel").addEventListener("click",e=>{

                        this.showPanelCreate();

                });

                 //method
                this.formUpdateEl.addEventListener("submit",event=>{
                         event.preventDefault();
                        
                          
                        let btn = this.formUpdateEl.querySelector("[type=submit]");
                    
                        btn.disabled = true;
                        let values = this.getValues(this.formUpdateEl);
                       
                        let index = this.formUpdateEl.dataset.trIndex;
                       
                        let tr = this.tableEl.rows[index];

                        let userOld = JSON.parse(tr.dataset.user);//PATH ANTIGO
                        
                        let result = Object.assign({}, userOld ,values); //SOBRESCREVENDO para userOld

                      
 
                      
                       

                        this.getPhoto(this.formUpdateEl).then(//retorna Promisse
                        (content)=>{//resolve
                                
                                //se valor vazio
                                if(!values.photo) result._photo = userOld._photo; //atribuindo ao campo foto um valor da foto antiga
                                
                                else{
                                        result._photo = content;
                                }
                                tr.dataset.user=JSON.stringify(result); //ID update

                                tr.innerHTML
                               
                                
                          =`
                                <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                                <td>${result._name}</td>
                                <td>${result._email}</td>
                                <td>${(result._admin) ?' Sim ':' Não ' }</td>  
                                <td>${Utils.dateFormat(result._register)}</td>
                                <td>
                                <button type="button" class="btn btn-primary btn-edit dbtn-xs btn-flat">Editar</button>
                                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                                </td>
                        
                          `;                   
        
                                this.addEventsTR(tr);  //method
                                this.updateCount(); //method
        ;

                                this.formUpdateEl.reset();
                                btn.disabled=false;

                        this.formEl.reset();
                         btn.disabled=false;
                        this.showPanelCreate();

                        },
                        (e)=>{ //reject
                        console.error(e);//erro capturado e jogado no console
                        });

                });
        }

         //method
        onSubmit(){
             this.formEl.addEventListener("submit",event=>{ 
                event.preventDefault();

                let btn = this.formEl.querySelector("[type=submit]");
                    
                btn.disabled = true;
                let values = this.getValues(this.formEl);//values vira o método getValues();
             
                if(!values)return false;
                //value dentro do getPhoto recebe um boolean
                
               this.getPhoto(this.formEl).then(//retorna Promisse
               (content)=>{//resolve
                    values.photo = content;//função values recebe no atributo photo o conteúdo
                    this.addLine(values);//adiciona a função na view
                    
                    this.formEl.reset();
                    btn.disabled=false;
                },
                (e)=>{ //reject
                    console.error(e);//erro capturado e jogado no console
               });
            });
        }
         getPhoto(formEl){
            return new Promise((resolve,reject)=>{
                    let fileReader = new FileReader();
                    let elements = [...formEl.elements].filter(item=>{
                            if(item.name === 'photo'){
                                    return item;//retorna item para a posição do array 
                            }
                    });
                    let file = elements[0].files[0]; //indíce do novo array
                              
                    fileReader.onload = () =>{//resolve promise
            
                             resolve(fileReader.result);//resultado da url
                    };
    
                    fileReader.onerror =(e)=>{//reject promise
                            reject(e); //erro na leitura do path
                    }
                   if(file){
                             fileReader.readAsDataURL(file); //leitura do path 
                   }else{
                    resolve('dist/img/boxed-bg.jpg');
                   } 
            });
          }
        getValues(formEl){   
            let user ={}; //Objeto vazio
            let isValid = true;  //validar forms
       
            [...formEl.elements].forEach(function(field,index){
                                                                        //!field.value não tem valor
                if(['name','email','password'].indexOf(field.name)>-1 && !field.value){
                        (field.parentElement.classList.add('has-error'));
                            isValid =false;
                }

                if(field.name =="gender"){
                        if(field.checked){
                                user[field.name] = field.value;
                        }
                }else if(field.name =="admin"){
                    user[field.name]= field.checked;
                }else{
                        user[field.name] =field.value ;
                }                 
        });
        if(!isValid){
              return  false;
        }
          return  new User(
                user.name,
                user.gender,
                user.birth,
                user.country,
                user.email,
                user.password,
                user.photo,
                user.admin             
                );   
        }
         addLine(dateUser){
                  
            let tr = document.createElement('tr');
            
            tr.dataset.user = JSON.stringify(dateUser);
            
            tr.innerHTML
                         //valor colocado na tabela
                   =`
                   <td><img src="${dateUser.photo}" alt="User Image" class="img-circle img-sm"></td>
                   <td>${dateUser.name}</td>
                   <td>${dateUser.email}</td>
                   <td>${(dateUser.admin) ?' Sim ':' Não ' }</td>  
                   <td>${Utils.dateFormat(dateUser.register)}</td>
                   <td>
                     <button type="button" class="btn btn-primary btn-edit dbtn-xs btn-flat">Editar</button>
                     <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                   </td>
            
                   `;      
                   this.addEventsTR(tr);

                   this.tableEl.appendChild(tr);
                   this.updateCount();
                }  

                addEventsTR(tr){
                                     //botão editar
                                     tr.querySelector(".btn-edit").addEventListener("click",e=>{

                                        let json = JSON.parse(tr.dataset.user);
                                       
                                      
                                        this.formUpdateEl.dataset.trIndex =tr.sectionRowIndex; // ID do form
        
                                        //for in     //name index //json forms   
                                        for(let name in json){                            //substitui     
                                             let field = this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "]");     
                                                        if(field){        
                                                                switch(field.type){
                                                                        case 'file':
                                                                                 continue;
                                                                         break;
        
                                                                        case 'radio':
                                                                                 field = this.formUpdateEl.querySelector("[name=" + name.replace("_","") + "][value="+json[name]+"]");     
                                                                                 field.checked=true;
                                                                         break;
                                                                         case 'checkbox':
                                                                                     field.checked = json[name];
                                                                                break;
                                                                                default:
                                                                                        field.value = json[name];
                                                                        }
                                        
                                                        }
                                        }
                                        this.formUpdateEl.querySelector(".photo").src=json._photo; //NEW LINE
                                        this.showPanelUpdate();
                                }) 
                }

                //invocado dentro do onEdit
                showPanelCreate(){
                                document.querySelector("#box-user-create").style.display="block";
                                document.querySelector("#box-user-update").style.display="none";           
                }

                //invocado dentro do addLine
                showPanelUpdate(){
                        document.querySelector("#box-user-create").style.display="none";
                        document.querySelector("#box-user-update").style.display="block";
                      
                }
          
          
        updateCount(){
            
                let numberUsers = 0;
                let numberAdmin = 0;

                [...this.tableEl.children].forEach(tr=>{
                        numberUsers++;
     
                       let user = (JSON.parse(tr.dataset.user))  //user acesso a tr
                        if(user._admin) numberAdmin ++;  // if == adim ++
                        
                });          
                document.querySelector("#number-users").innerHTML = numberUsers;
                document.querySelector("#number-users-admin").innerHTML = numberAdmin;

        }

    }