<template>
  <div id="wordcloud">
    <h1>专家论文词云</h1>
      <div ref="academywordcloud" style="height:800px"></div>
      <div ref="papercountchange" style="height:500px; width: 500px"></div>
      <div ref="leida" style="height:500px; width: 500px"></div>
  </div>
</template>

<script>
import * as d3 from 'd3';
import wordcloud from 'vue-wordcloud';
import axios from 'axios';
// let scholarid = 'CN-BE75L9BJ';
let scholarid = 'CN-BR75D2LJ';
require("echarts-wordcloud");

export default {
  name: "academyWordCloud",
  components:{
    wordcloud,
  },
  data () {
    return {
      keyword: [],
      abstract: [],
      total: [],
      myChart: null,
      author: '',
      years: [],
      paper_count: [],
      years_paperCount: {},
      dataleida: [],
    }
  },
  created() {
    // this.getscholarById(scholarid);
  },

  mounted () {
    this.getscholarById(scholarid);
  },

  methods: {
    getscholarById: function (scid) {
      axios.get('./../../static/thsswords.json').then(res => {
        let resdata = res.data[scid];
        console.log(resdata);

        //词云数据处理
        for(let key in resdata.keyword){
                let keyword_item = {
                  name: '',
                  value: 0,
                  paperfrom: [],
                }
                if(resdata.keyword[key] > 0){
                  for (let messageitem of resdata.message){
                    if(messageitem.keyword === key){
                      keyword_item.paperfrom = messageitem.messages;
                      for (let i = 0; i < messageitem.messages.length; i++){
                        keyword_item.paperfrom[i].paper = resdata.paper[i].name;
                      }
                    }
                  }
                  console.log("keyword_item", keyword_item);
                  keyword_item.name = key;
                  keyword_item.value = resdata.keyword[key];
                  this.keyword.push(keyword_item);
                }
        }
        this.myChart = this.$echarts.init(this.$refs.academywordcloud);
        this.myChart.setOption({
          tooltip: {
            show: true,
            // trigger: 'item',
            formatter(params) {
              let resstr = '词: ' + params.data.name + ' <br>' + '词频: ' + params.data.value + '<br>';
              for (let paper of params.data.paperfrom){
                resstr +='题目：' + paper.paper + ', 作者：'+ paper.author + ', 年份：'+paper.year + '<br>';
              }
              return resstr;
            }
          },
          series: [
            {
              type: "wordCloud",
              data: this.keyword,
              drawOutOfBound: false,
              shape: 'circle',
              textStyle: {
                normal: {
                  fontFamily: "sans-serif",
                  fontWeight: "bold",
                  color: function () {
                    return (
                      "rgb(" +
                      [
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255),
                        Math.round(Math.random() * 255)
                      ].join(",") +
                      ")"
                    );
                  }
                },
                emphasis: {
                  shadowBlur: 10,
                  shadowColor: "#300"
                }
              }
            }
          ]

        });

        //论文数量变化数据处理
        let years = new Set();
        for(let paper of resdata.paper){
          years.add(paper.year);
          if(!this.years_paperCount.hasOwnProperty(paper.year)){
            this.years_paperCount[paper.year] = 1;
          }
          else{
            this.years_paperCount[paper.year]++;
          }
        }
        this.years = Array.from(years);
        this.years.sort();
        Object.keys(this.years_paperCount).sort();
        for(let item in this.years_paperCount){
          this.paper_count.push(this.years_paperCount[item]);
        }
        this.myChartPaperCount = this.$echarts.init(this.$refs.papercountchange);
        this.myChartPaperCount.setOption({
          title: {
            text: '论文数量变化图'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['论文数量',]
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.years
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '论文数量',
              type: 'line',
              stack: '总量',
              data: this.paper_count
            }
          ]
        });

        //雷达图
        axios.get('./../../static/thssleida.json').then(res => {
          this.dataleida.push(res.data[scid]);
          console.log("雷达图数据", this.dataleida);
          var lineStyle = {
            normal: {
              width: 1,
              opacity: 0.5
            }
          };
          this.myChartleida= this.$echarts.init(this.$refs.leida);
          this.myChartleida.setOption({
            backgroundColor: '#161627',
            title: {
              text: '学者个人数据 - 雷达图',
              left: 'center',
              textStyle: {
                color: '#eee'
              }
            },
            legend: {
              bottom: 5,
              data: [this.author],
              itemGap: 20,
              textStyle: {
                color: '#fff',
                fontSize: 14
              },
              selectedMode: 'single'
            },
            radar: {
              //引用次数，成果数，H指数，G指数，期刊，会议，专著，合作学者数量
              indicator: [
                {name: '引用次数', max: 2132},
                {name: '成果数', max: 130},
                {name: 'H指数', max: 16},
                {name: 'G指数', max: 27},
                {name: '期刊', max: 63},
                {name: '会议', max: 17},
                {name: '专著', max: 1.18},
                {name: '合作学者数量', max: 12},
              ],
              shape: 'circle',
              splitNumber: 5,
              name: {
                textStyle: {
                  color: 'rgb(238, 197, 102)'
                }
              },
              splitLine: {
                lineStyle: {
                  color: [
                    'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                    'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                    'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)',
                    'rgba(238, 197, 102, 1.1)', 'rgba(238, 197, 102, 1.2)',
                  ].reverse()
                }
              },
              splitArea: {
                show: false
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(238, 197, 102, 0.5)'
                }
              }
            },
            series: [
              {
                name: this.author,
                type: 'radar',
                lineStyle: lineStyle,
                data: this.dataleida,
                symbol: 'none',
                itemStyle: {
                  color: '#F9713C'
                },
                areaStyle: {
                  opacity: 0.1
                }
              },
            ]

          })

        })
      })
    },

  }
}
</script>

<style scoped>

</style>
