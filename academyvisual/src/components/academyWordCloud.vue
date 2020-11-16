<template>
  <div id="wordcloud">
    <h1>专家论文词云</h1>
    <svg width="960" height="600"></svg>
    <word-cloud
      :data="abstract"
      nameKey="text"
      valueKey="size">
    </word-cloud>
  </div>
</template>

<script>
import wordcloud from 'vue-wordcloud';
import axios from 'axios';

let scholarid = 'CN-BY75RX7J';

export default {
  name: "wordCloud",
  components:{
    wordcloud,
  },
  data () {
    return {
      keyword: [],
      abstract: [],
    }
  },

  mounted () {
    let svg = d3.select('svg');
    let width = +svg.attr('width');
    let height = +svg.attr('height');
    this.getscholarById(scholarid);
    // d3.wordcloud()
    //   .size([800, 400])
    //   .selector('#wordcloud')
    //   .words([{text: 'word', size: 5}, {text: 'cloud', size: 15}])
    //   .start();
  },

  methods: {
    getscholarById: function (scid) {
      axios.get('./../../static/words.json').then(res => {
        console.log(res.data.length);
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].id === scid) {
            let resdata = res.data[i];
            for(let key in resdata.keyword){
              let keyword_item = {
                text: '',
                size: 0,
              }
              keyword_item.text = key;
              keyword_item.size = resdata.keyword[key];
              this.keyword.push(keyword_item)
            }
            for(let key in resdata.abstract){
              let keyword_item = {
                text: '',
                size: 0,
              }
              keyword_item.text = key;
              keyword_item.size = resdata.abstract[key];
              this.abstract.push(keyword_item)
            }
            console.log("第几个", i, this.keyword);

          }
        }
        console.log(this.keyword_num);
      })
    },
  }
}
</script>

<style scoped>

</style>
