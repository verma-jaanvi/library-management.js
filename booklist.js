//book class: represent a book
//script is assigned or linked inside the body tag
class Book{
    constructor(title, author, isbn){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
    }
}

//UI class: handle ui tasks
class UI{
    static displayBooks(){
        const StoredBooks = Store.getBooks();
        //stored books: array of books
    //     const StoredBooks=[
    //         {
    //         title: 'Book One',
    //         author: 'John Doe',
    //         isbn: '3434434'
    //     },
    //     {
    //         title: 'Book Two',
    //         author: 'Jane Doe',
    //         isbn: '45545'
    //     }
    // ];
        //creating variable of the array to access it 
        const books = StoredBooks;
        //looping through the books and calling the function for each book element
        books.forEach((book)=> UI.addBookToList(book));
    }
    //here book is the parameter
    static addBookToList(book){
        //creating row to add book into it as row is added inside the tbody
        const  list = document.querySelector('#book-list');

        //creating a new row
        const row = document.createElement('tr');

        //in each row there is 3 col and one delete button
        row.innerHTML = `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

        //adding the row to the table
        list.appendChild(row);
    }

    //to delete the book when clicked on the red button th anchor tag
    static deleteBook(el){
        if(el.classList.contains('delete')) // makes sure that when we click on the red delete button only to delete the element
            {
            el.parentElement.parentElement.remove(); // targeting the parent of anchor tag that is td and then its parent element tr.
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        //putting the created div in this container 
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form); // inserting the div element before the form element
    
        //to vanish the alert after 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    //to clear the form after the submit is done
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

//note that the local storage stores in the key value pair not any objects only string format
// store class: handles storage
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }
        else{
            books = JSON.parse(localStorage.getItem('books')); // json.parse methods makes sures that the element is added in a regular array form rather than a string format
        }
        return books;
    }

    static addBooks(){
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }

    static removeBooks(isbn){
        const book = Store.getBooks();

        book.forEach((book, index) => {
            if(book.isbn === isbn){
                book.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(book));

    }
};


//events: display books, as soon as the DOM loads it will be called 
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//event: add a book
  //grabing the form and adding an event listener
document.querySelector('#book-form').addEventListener('submit',(e)=>
    {
        e.preventDefault();
        //getting form values
        const title = document.querySelector('#title').value;
        const author = document.querySelector('#author').value;
        const isbn = document.querySelector('#isbn').value;

        //Validate : if any of the field is empty then raise an alert
        if(title==''||author==''||isbn==''){
            UI.showAlert('Please fill in all fields','danger');
        }
        else{
            //instantiate a book from the book class 
            const book = new Book(title, author, isbn);

            // console.log(book);

            //add book to UI
            UI.addBookToList(book);

            //add book to store
            Store.addBooks(book);


            //show success message
            UI.showAlert('Book Added!', 'success');

            //clear the fields after submit
            UI.clearFields();

        }
});


//event: remove a book
document.querySelector('#book-list').addEventListener('click',(e)=>{

    UI.deleteBook(e.target);

    //remove book from store 
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

    //show the message of successful deletion 
    UI.showAlert('Book Removed!', 'success');
});


//static methods can be called directly without initiating the class