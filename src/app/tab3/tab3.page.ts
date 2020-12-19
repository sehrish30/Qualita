import { NavController } from '@ionic/angular';
import { FbService } from './../fb.service';
import { Component } from '@angular/core';
import { ReversePipe } from 'ngx-pipes';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  providers: [ReversePipe],
})
export class Tab3Page {
  public filter;
  public matchedProducts;
  public amazonItems;
  public alibabaItems;
  public amazonCheck;
  public alibabaCheck;
  public priceFilter;
  public ratingFilter;

  public performance = 1;

  // For Filtering
  constructor(
    public FBSrv: FbService,
    public navCtrl: NavController,
    private reversePipe: ReversePipe,
    private storage: Storage
  ) {
    this.storage.get('rating').then((value) => {
      this.ratingFilter = value;
    });
    this.storage.get('price').then((value) => {
      this.priceFilter = value;
    });
  }
  handleTypeChanges(evt) {
    // this evt is the value passed of ngModel
    if (this.performance > 1) {
      this.handleSearch();
    }
    if (evt.length > 0) {
      this.getProducts();
    } else {
      this.matchedProducts = [];
    }
  }

  saveFilterOptionsToLocalStorage(evt) {
    this.storage.set('rating', this.ratingFilter);
    this.storage.set('price', this.priceFilter);
    this.handleTypeChanges(evt);
  }

  handleChange(evt) {
    if (evt.key === 'Enter') {
      this.filter = evt.target.value;
      this.getProducts();
    }
  }

  getProducts() {
    if (this.performance === 1) {
      const query = this.filter.toLowerCase();

      /*-----------------------------------------
          Get Amazon products
    -----------------------------------------*/
      this.amazonCheck = this.FBSrv.alibabaProducts.subscribe((snapshot) => {
        this.amazonItems = snapshot.map((doc) => {
          return doc;
        });

        this.amazonCheck.unsubscribe();
      });

      /*-----------------------------------------
          Get Alibaba products
    -----------------------------------------*/

      this.alibabaCheck = this.FBSrv.amazonProducts.subscribe((snapshot) => {
        this.alibabaItems = snapshot.map((doc) => {
          return doc;
        });

        this.alibabaCheck.unsubscribe();
        this.handleSearch();
      });
      this.performance += 1;
    }
  }

  formatRate(first, second) {
    first.rating = first.rating.slice(0, 3);
    second.rating = second.rating.slice(0, 3);
  }

  /*-----------------------------------------
                 Filtering Price
    -----------------------------------------*/

  compareHigh = (first, second) => {
    if (Number(first.price) < Number(second.price)) {
      return 1;
    }
    if (Number(first.price) > Number(second.price)) {
      return -1;
    }
    return 0;
  };

  compareLow = (first, second) => {
    if (first.length > 1) {
      first = first.replace('', ',');
    }

    if (Number(first.price) > Number(second.price)) {
      return 1;
    }
    if (Number(first.price) < Number(second.price)) {
      return -1;
    }
    return 0;
  };

  /*-----------------------------------------
                 Filtering Rate
    -----------------------------------------*/

  compareHighRate = (first, second) => {
    if (first.rating.length > 3 || second.rating.length > 3) {
      this.formatRate(first, second);
    }

    if (Number(first.rating) < Number(second.rating)) {
      return 1;
    }
    if (Number(first.rating) > Number(second.rating)) {
      return -1;
    }
  };
  compareLowRate = (first, second) => {
    if (first.rating.length > 3 || second.rating.length > 3) {
      this.formatRate(first, second);
    }

    if (Number(first.rating) > Number(second.rating)) {
      return 1;
    }
    if (Number(first.rating) < Number(second.rating)) {
      return -1;
    }
  };

  /*-----------------------------------------
        Filtering High Price and High Rate
    -----------------------------------------*/

  compareHighPriceAndHighRating(first, second) {
    if (first.rating.length > 3) {
      first.rating = first.rating.slice(0, 3);
    }
    if (second.rating.length > 3) {
      second.rating = second.rating.slice(0, 3);
    }

    if (
      Number(first.price) < Number(second.price) &&
      Number(first.rating) < Number(second.rating)
    ) {
      return 1;
    }
    if (
      Number(first.price) > Number(second.price) &&
      Number(first.rating) > Number(second.rating)
    ) {
      return -1;
    }
    return 0;
  }

  /*-----------------------------------------
        Filtering Low Price and Low Rate
    -----------------------------------------*/

  compareLowPriceAndLowRating(first, second) {
    if (first.rating.length > 3) {
      first.rating = first.rating.slice(0, 3);
    }
    if (second.rating.length > 3) {
      second.rating = second.rating.slice(0, 3);
    }

    if (
      Number(first.price) > Number(second.price) &&
      Number(first.rating) > Number(second.rating)
    ) {
      return 1;
    }
    if (
      Number(first.price) < Number(second.price) &&
      Number(first.rating) < Number(second.rating)
    ) {
      return -1;
    }
    return 0;
  }

  /*-----------------------------------------
        Filtering Low Price and High Rate
    -----------------------------------------*/
  compareLowPriceAndHighRating(first, second) {
    if (first.rating.length > 3) {
      first.rating = first.rating.slice(0, 3);
    }
    if (second.rating.length > 3) {
      second.rating = second.rating.slice(0, 3);
    }

    if (
      Number(first.price) > Number(second.price) &&
      Number(first.rating) < Number(second.rating)
    ) {
      return 1;
    }
    if (
      Number(first.price) < Number(second.price) &&
      Number(first.rating) > Number(second.rating)
    ) {
      return -1;
    }
    return 0;
  }

  /*-----------------------------------------
        Filtering High Price and Low Rate
    -----------------------------------------*/

  compareHighPriceAndLowRating(first, second) {
    if (first.rating.length > 3) {
      first.rating = first.rating.slice(0, 3);
    }
    if (second.rating.length > 3) {
      second.rating = second.rating.slice(0, 3);
    }

    if (
      Number(first.price) < Number(second.price) &&
      Number(first.rating) > Number(second.rating)
    ) {
      return 1;
    }
    if (
      Number(first.price) > Number(second.price) &&
      Number(first.rating) < Number(second.rating)
    ) {
      return -1;
    }
    return 0;
  }

  /*-----------------------------------------
                 Search handling
    -----------------------------------------*/

  handleSearch() {
    this.matchedProducts = [];
    const query = this.filter.toLowerCase();
    this.matchedProducts = this.amazonItems.filter((product) => {
      return (
        product.title.toLowerCase().includes(query) ||
        product.badge?.toLowerCase().includes(query)
      );
    });
    const alibabaProducts = this.alibabaItems.filter((product) => {
      return (
        product.title.toLowerCase().includes(query) ||
        product.badge?.toLowerCase().includes(query)
      );
    });

    this.matchedProducts.push(...alibabaProducts);

    if (this.priceFilter === 'high' && this.ratingFilter === 'high') {
      this.matchedProducts.sort(this.compareHighPriceAndHighRating);
    }

    if (this.priceFilter === 'low' && this.ratingFilter === 'low') {
      this.matchedProducts.sort(this.compareLowPriceAndLowRating);
    }

    if (this.priceFilter === 'high' && this.ratingFilter === 'low') {
      this.matchedProducts.sort(this.compareHighPriceAndLowRating);
    }

    if (this.priceFilter === 'low' && this.ratingFilter === 'high') {
      this.matchedProducts.sort(this.compareLowPriceAndHighRating);
    }

    if (this.priceFilter === 'high') {
      this.matchedProducts.sort(this.compareHigh);
    }
    if (this.priceFilter === 'low') {
      this.matchedProducts.sort(this.compareLow);
    }

    if (this.ratingFilter === 'high') {
      this.matchedProducts.sort(this.compareHighRate);
    }
    if (this.ratingFilter === 'low') {
      this.matchedProducts.sort(this.compareLowRate);
    }
  }
}
