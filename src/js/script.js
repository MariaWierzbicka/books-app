{
  'use strict';

  const select = {
    templateOf: {
      book: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
    book: {
      image: '.book__image',
      imageId: 'data-id',
    },
    ratingBgc: {
      lvlOne: 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)',
      lvlTwo: 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)',
      lvlThree: 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)',
      lvlFour: 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)'
    },
    classNames: {
      hidden: 'hidden',
      favorite: 'favorite'
    }
  };

  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
  }

  class BooksList{
    constructor(){
      const thisBooksList = this;

      thisBooksList.initData();
      thisBooksList.getElements();
      thisBooksList.renderBooks();
      thisBooksList.initActions();
    }
    getElements(){
      const thisBooksList = this;

      thisBooksList.booksListContainer = document.querySelector(select.containerOf.booksList);
      thisBooksList.filtersForm = document.querySelector(select.containerOf.filters);
    }    

    renderBooks(){
      const thisBooksList = this;
      for (let book of thisBooksList.data){
        const rating = book.rating;
        const ratingBgc = thisBooksList.determineRatingBgc(rating);
        const ratingWidth = (rating * 10);
        const bookParams = {
          id: book.id,
          name: book.name,
          price: book.price,
          rating: book.rating,
          image: book.image,
          details: book.details,
          ratingBgc: ratingBgc,
          ratingWidth: ratingWidth
        };

        const generatedHTML = templates.book(bookParams);
        const element = utils.createDOMFromHTML(generatedHTML);
        
        thisBooksList.booksListContainer.appendChild(element);
      }
    }
    initData(){
      this.data = dataSource.books;
    }

    determineRatingBgc(rating){
      let background;
      if (rating <= 6){
        background = select.ratingBgc.lvlOne;
      } else if (rating > 6 && rating <= 8){
        background = select.ratingBgc.lvlTwo;
      } else if (rating > 8 && rating <= 9){
        background = select.ratingBgc.lvlThree;
      } else if (rating > 9){
        background = select.ratingBgc.lvlFour;
      }
      return background;
    }
    initActions(){
      const thisBooksList = this;
      const favoriteBooks = [];
      const filters = [];
      
      thisBooksList.booksListContainer.addEventListener('dblclick', function(event){
        event.preventDefault();
        const bookImageElem = event.target.offsetParent;

        if(bookImageElem.classList.contains('book__image')){
          const bookId = bookImageElem.getAttribute(select.book.imageId);

          if(!favoriteBooks.includes(bookId)){
            bookImageElem.classList.add(select.classNames.favorite);
            favoriteBooks.push(bookId);            
          } else {
            bookImageElem.classList.remove(select.classNames.favorite);
            favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1);
          }
        }
      }
      );

      thisBooksList.filtersForm.addEventListener('click', function(event){
        const filter = event.target;
        if(filter.name == 'filter' && filter.tagName == 'INPUT' && filter.type == 'checkbox'){
          console.log(filter);
          if(filter.checked){
            filters.push(filter.value);
          } else {
            filters.splice(filters.indexOf(filter.value), 1);
          }
        }
        thisBooksList.filterBooks(filters);
      });    
    }
    filterBooks(filters){
      const thisBooksList = this;
      const bookImageElems = document.querySelectorAll(select.book.image);

      for (let book of thisBooksList.data){
        let shouldBeHidden = false;
        
        for (let filter of filters){
          if (!book.details[filter]){
            shouldBeHidden = true;
            break;
          }
        }      
        for (let bookImg of bookImageElems){
          if (book.id == bookImg.getAttribute('data-id')){
            if (shouldBeHidden){
              bookImg.classList.add(select.classNames.hidden);
            } else {
              bookImg.classList.remove(select.classNames.hidden);
            }
          }  
        }      
      }
    }
  }

  const app = new BooksList();

}



