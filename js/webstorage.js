'use strict'

const ITEMSTORAGE = 'liste de course';
let btnItem;
/**
 * Récupérer la liste des courses du webstorage
 */
function getLocalStorage(){
    let listJs = [];
    let listJSON = window.localStorage.getItem(ITEMSTORAGE);
    
    //si l'item exist
    if(listJSON !== null){
        listJs = JSON.parse(listJSON);
    };
    return listJs;
};

/**
 * sauvegarder la liste de courses
 */
function saveLocalStorage(list){
    
    let listJSON = JSON.stringify(list);
    window.localStorage.setItem(ITEMSTORAGE, listJSON);
}
/**
 * addProduct()
 * @return array liste de course
 * Enregistre un produit saisi dans la liste de courses du webstorage
 * qui représente un tableau
 * 1. Chercher la liste dans le webstorage (récupérer un JSON)
 * 
 */
function onClickAddProduct(){
    //récupérer une saisie : un objet
    
    let fieldProduct = document.getElementById('product');
    let fieldQuantity = document.getElementById('quantity');
    let fieldPackaging = document.querySelector('[name="packaging"]:checked');

    let product= {
        product : fieldProduct.value,
        quantity : fieldQuantity.value,
        packaging : fieldPackaging.value,
    };
    let products =  JSON.stringify(product);
    window.localStorage.setItem('shoppingList', products);
    

    //Récupération du tableau JS
    
    let listProduct= getLocalStorage() ;
    //si le déclencheur contient data.id c'est donc une moficiation
    if(this.dataset.id !== undefined){
        
        listProduct[this.dataset.id] = product;
        
        // this.removeAttribut('data-id');
    } else {
        listProduct.push(product);
    }

    // listProduct.push(product);
    saveLocalStorage(listProduct);
    // console.log(listProduct);

    //Réinitialiser le formulaire en cliquant sur le bouton reset
    document.getElementById('reset-product').click();
    displayList();
}

/**
 * displayList
 * afficher la liste dans le document html
 * 1 récupérer la liste
 * 2 Si la liste n'est pas vide : 
 *          -> Créer une liste numéroté
 *          -> pour chaque produit : 
 *              1- Créer une li
 *              2- Insérer les informations du produit
 * 3 sinon,afficher : la liste est vide
 * 4 Insérer la liste dans le document html 
 *          
 */
function displayList(){
    let container = document.getElementById('list');
    let listProducts = getLocalStorage();
    
    if(listProducts.length === 0 ){
        container.innerHTML = " <p> La liste est vide </p>";
        container.nextElementSibling.style.visibility='hidden';
        return;
    }
    container.nextElementSibling.style.visibility='visible';
    let ol = document.createElement('ol');
    ol.setAttribute('id', 'parent');
    

    for (let i = 0; i < listProducts.length; i++) {

        let li = document.createElement('li');  
        li.textContent = listProducts[i].product + ' ' + listProducts[i].quantity + ' ' + listProducts[i].packaging ;
        let btnItem = document.createElement('button');
        btnItem.textContent="supprimer";
        btnItem.dataset.id= i;
        btnItem.classList.add('btn-delete');
        
        li.appendChild(btnItem);
        ol.appendChild(li);

        //modifier un produit
        let btnEdit = document.createElement('button');
        btnEdit.textContent = "modifier";
        btnEdit.dataset.id= i;
        li.appendChild(btnEdit);
        console.log(btnEdit);
        
    }
    
    //vider la liste précédente
    container.innerHTML='';
    container.append(ol);
}

/**
 * supprime toute la liste et le localstorage
 */
function clearLocalStorageItem(){
    if(window.confirm('supprimer?')){
        window.localStorage.removeItem(ITEMSTORAGE);
        displayList();
    }
}
function deleteItem(e){
    let index = e.target.dataset.id;
    if(!e.target.classList.contains('btn-delete')){
        return;
    }
    let itemtoDelet = getLocalStorage();
    itemtoDelet.splice(index,1);
    saveLocalStorage(itemtoDelet);
    displayList();
}

/**
 * Charger les données d'un produit dans le formulaire
 */
function onClickLoadProduct(e){
    let index = e.target.dataset.id;
    if(e.target.textContent !== 'modifier'){
        return;
    };
    let productToEdit = getLocalStorage()[index];
    
    let fieldProduct = document.getElementById('product');
    let fieldQuantity = document.getElementById('quantity');
    let fieldPackaging = document.querySelector('[name="packaging"][value='+ productToEdit.packaging +']');
    fieldPackaging.toggleAttribute('checked');

    fieldQuantity.value = productToEdit.quantity;
    fieldProduct.value = productToEdit.product;
    fieldPackaging.value = productToEdit.packaging;

    let btnValidForm = document.getElementById('add-product');
    btnValidForm.dataset.id = index;
    btnValidForm.textContent= "modifier ce produit"; 
    
}


/**
 * CODE EXECUTE AU CHARGEMENT 
 */
document.addEventListener('DOMContentLoaded', function(){
    //Installation du gestionaire d'évènement sur le bouton add product
    let buttonAddProduct = document.getElementById('add-product');
    let buttonClearProduct = document.getElementById('clear-list');
    buttonAddProduct.addEventListener('click',onClickAddProduct);
    buttonClearProduct.addEventListener('click', clearLocalStorageItem);  
    document.addEventListener('click', deleteItem);
    document.addEventListener('click', onClickLoadProduct);
    displayList();

    document.getElementById('reset-product').addEventListener('click', function(){
        if(buttonAddProduct.dataset.id !== undefined){
            buttonAddProduct.textContent = "valider";
            buttonAddProduct.removeAttribute('data-id'); 
        }
    });
})
