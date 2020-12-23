import { ActivatedRoute } from '@angular/router';
import { FbService } from './../fb.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { getLocaleNumberSymbol } from '@angular/common';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {
  @ViewChild('barCanvas') barCanvas: ElementRef;
  @ViewChild('doughnutCanvas') doughnutCanvas: ElementRef;
  @ViewChild('lineCanvas') lineCanvas: ElementRef;

  private barChart: Chart;
  private doughnutChart: Chart;
  private lineChart: Chart;
  public labels = [];
  public price = [];
  public rating = [];
  public votes = [];

  public time;

  constructor(public FbSrv: FbService, public activatedrouter: ActivatedRoute) {
    this.time = this.activatedrouter.snapshot.paramMap.get('products');

    this.FbSrv.reportHistory.subscribe((snapshot) => {
      snapshot.map((data) => {
        // console.log(
        //   data.time.nanoseconds,
        //   this.time.slice(13, this.time.length)
        // );

        console.log(FbSrv.chosenItemsDetails);
        console.log(data);
        if (
          this.time &&
          Number(data.time.nanoseconds) ===
            Number(this.time.slice(13, this.time.length))
        ) {
          FbSrv.chosenItemsDetails = [];
          FbSrv.chosenItemsDetails.push(...data.products);
          // debugger;
          console.log(data.products);
          data.products.map((item) => {
            this.labels.push(item.title.slice(0, 10));
            this.price.push(item.price);
            this.rating.push(item.rating.slice(0, 3));
            this.votes.push(item.voteCount);
            // FbSrv.chosenItemsDetails = [];
          });
        }
      });
    });

    if (!this.time) {
      FbSrv.chosenItemsDetails.map((data) => {
        this.labels.push(data.title.slice(0, 10));
        this.price.push(data.price);
        this.rating.push(data.rating.slice(0, 3));
        this.votes.push(data.voteCount);
        console.log(this.price);
        console.log(this.rating);
        console.log(this.labels);
        console.log(this.votes);
      });
    }
  }

  ngOnInit() {
    this.showChart();
  }

  showChart() {
    let ctx = (document.getElementById('report') as any).getContext('2d');
    let paya = (document.getElementById('pie') as any).getContext('2d');
    let rate = (document.getElementById('rating') as any).getContext('2d');
    let vote = (document.getElementById('voting') as any).getContext('2d');

    let chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Price',
            backgroundColor: [
              '#9f5f80',
              '#9f5f80',
              '#9f5f80',
              '#9f5f80',
              '#9f5f80',
              '#9f5f80',
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
              'rgba(255,99,132,1)',
            ],
            data: this.price,
            borderWidth: 1,
          },
          {
            label: 'Rating',
            backgroundColor: [
              '#ffd66b',
              '#ffd66b',
              '#ffd66b',
              '#ffd66b',
              '#ffd66b',
              '#ffd66b',
            ],
            borderColor: [
              'rgba(255, 159, 64, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            data: this.rating,
            borderWidth: 1,
          },
        ],
      },
    });
    let pie = new Chart(paya, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Price',
            backgroundColor: [
              '#9f5f80',
              '#583d72',
              '#ff8e71',
              '#70af85',
              '#6155a6',
              '#d68060',
            ],
            borderColor: [
              '#9f5f80',
              '#583d72',
              '#ff8e71',
              '#70af85',
              '#6155a6',
              '#d68060',
            ],
            data: this.price,
            borderWidth: 1,
          },
        ],
      },
    });
    let ratePie = new Chart(rate, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Price',
            backgroundColor: [
              '#9f5f80',
              '#583d72',
              '#ff8e71',
              '#70af85',
              '#6155a6',
              '#d68060',
            ],
            borderColor: [
              '#9f5f80',
              '#583d72',
              '#ff8e71',
              '#70af85',
              '#6155a6',
              '#d68060',
            ],
            data: this.rating,
            borderWidth: 1,
          },
        ],
      },
    });
    let votePir = new Chart(vote, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: 'Price',
            backgroundColor: [
              '#9f5f80',
              '#583d72',
              '#ff8e71',
              '#70af85',
              '#6155a6',
              '#d68060',
            ],
            borderColor: [
              '#9f5f80',
              '#583d72',
              '#ff8e71',
              '#70af85',
              '#6155a6',
              '#d68060',
            ],
            data: this.votes,
            borderWidth: 1,
          },
        ],
      },
    });
  }
}
