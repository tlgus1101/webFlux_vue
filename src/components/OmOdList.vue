<template>
    <div class="container">
        <h2>주문 조회</h2>
        <div class="" style="margin-bottom:10px;">
          <input type="text" v-model="odNo" v-on:keyup.enter="search()" class="form-control" placeholder="주문번호">
          <input type="text" v-model="mbNo" v-on:keyup.enter="search()" class="form-control" placeholder="회원번호">
          <input type="text" v-model="odrNm" v-on:keyup.enter="search()" class="form-control" placeholder="주문자명">
        </div>
        <span class="input-group-btn">
          <button class="btn btn-default" style="margin: 10px" type="button" @click="init()">초기화</button>
          <button class="btn btn-default" style="margin: 10px" type="button" @click="search()">검색</button>
          <button class="btn btn-default" style="margin: 10px" type="button" @click="cancelList()"> 취소목록 검색 </button>
          <button class="btn btn-default" style="margin: 10px" type="button" @click="odPrgsStepCdList()"> 출고지시 이후 건 검색 </button>
        </span>
        <hr>
        <div>
            <table style="width:100%" border="1">
              <thead>
                <td style="width:10%">
                  주문번호
                </td>
                <td style="width:10%">
                  주문자명
                </td>
                <td style="width:10%">
                  상품명
                </td>
                <td style="width:10%">
                  주문유형코드
                </td>
                <td style="width:10%">
                  주문진행상태코드
                </td>
                <td style="width:10%">
                  수량
                </td>
                <td style="width:10%">
                  원가격
                </td>
                <td style="width:10%">
                  할인금액
                </td>
                <td style="width:10%">
                  주문완료일시
                </td>
                <td style="width:10%">

                </td>
              </thead>
              <tr v-for="(omod,i) in omOdList" :key=i v-if="omod.omOdDtlList.length > 0">
                <td rowspan="{omod.omOdDtlList.length}">
                  {{omod.odNo}}
                </td>
                <td rowspan="{omod.omOdDtlList.length}">
                  {{omod.odrNm}}
                </td>
                <td colspan="8">
                  <table style="width:100%">
                    <tr v-for="(dtl,j) in omod.omOdDtlList" :key=j>
                      <td style="width:10%">
                        {{ dtl.pdNm }}
                      </td>
                      <td style="width:10%">
                        {{ dtl.odTypCd }}
                      </td>
                      <td style="width:10%">
                        {{ dtl.odPrgsStepCd }}
                      </td>
                      <td style="width:10%">
                        {{ dtl.odQty }}
                      </td>
                      <td style="width:10%">
                        {{ dtl.slPrc }}
                      </td>
                      <td style="width:10%">
                        {{ dtl.dcAmt }}
                      </td>
                      <td style="width:10%">
                        {{dateFormat(dtl.odCmptDttm)}}
                      </td>
                      <td style="width:10%">
                        <button v-if="dtl.odTypCd != '20'" class="btn btn-default" style="margin: 10px" type="button" @click="cancelOmOd(dtl)">주문취소</button>
                        <button v-else class="btn btn-default" style="margin: 10px" type="button" disabled="disabled" @click="cancelOmOd(dtl)">취소완료</button>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
        </div>
      <hr>
      <div>
        <table style="width:100%" border="1">
          <thead>
          <td style="width:10%">
            상품 번호
          </td>
          <td style="width:10%">
            상품 이름
          </td>
          <td style="width:10%">
            상품 가격
          </td>
          <td style="width:10%">
            수량
          </td>
          <td style="width:10%">
            할인 금액
          </td>
          </thead>
          <tr v-for="(pd,j) in omOdDtlList" :key=j>
            <td style="width:10%">
              {{ pd.pdNo }}
            </td>
            <td style="width:10%">
              {{ pd.pdNm }}
            </td>
            <td style="width:10%">
              {{ pd.slPrc }}
            </td>
            <td style="width:10%">
              {{ pd.odQty }}
            </td>
            <td style="width:10%" v-on="dcPrcCk(pd)">
              {{ pd.dcAmt }}
            </td>
          </tr>
        </table>
        <span class="input-group-btn">
          <button class="btn btn-default" style="margin: 10px" type="button" @click="insert()"> 주문하기 </button>
        </span>
      </div>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
    name:'OmOdList',
    data(){
        return{
            msg:"OmOdList",
            odNo:"",
            mbNo:"",
            odrNm:"",
            omOdList:{},
          omOdDtlList:[
              {
                pdNo : "5",
                pdNm : "칫솔",
                slPrc : 2000,
                odQty : 3,
                prNo : "",
                dcAmt : 0,
                odSeq : 0,
              },
              {
                pdNo : "6",
                pdNm : "치약",
                slPrc : 1000,
                odQty : 5,
                prNo : "6",
                dcAmt : 0,
                odSeq : 0,
              },
              {
                pdNo : "7",
                pdNm : "컵",
                slPrc : 10000,
                odQty : 1,
                prNo : "",
                dcAmt : 0,
                odSeq : 0,
              },
              {
                pdNo : "8",
                pdNm : "물",
                slPrc : 1000,
                odQty : 5,
                prNo : "8",
                dcAmt : 0,
                odSeq : 0,
              },
            ],
          omOdFvrDtlList : [
              {
                prNo:"6",
                odSeq:0,
                prNm:"치약할인",
                fvrAmt:500,
                overlap:"N",
                aplyQty:0,
                dcTnnoCd:"1st",
                odFvrDvsCd:"HAPN",
                cpnNo:"1",
                cpnNm:"치약할인쿠폰"
              },
              {
                prNo:"8",
                odSeq:0,
                prNm:"물할인",
                fvrAmt:500,
                overlap:"Y",
                aplyQty:0,
                dcTnnoCd:"1st",
                odFvrDvsCd:"HAPN",
                cpnNo:"2",
                cpnNm:"물할인쿠폰"
              }
            ]
        }

    },
    mounted(){
        this.setList();
    },
    methods:{
        dcPrcCk(pd){
          for( var dc of this.omOdFvrDtlList ){
            if(dc.prNo == pd.prNo){
              if(dc.overlap == "Y"){
                 pd.dcAmt = dc.fvrAmt * pd.odQty;
                 dc.aplyQty = pd.odQty;
              }else{
                pd.dcAmt = dc.fvrAmt;
                dc.aplyQty = 1;
              }
            }
          }
        },
        search(){
          this.setList();
        },
        init(){
          this.odNo="";
          this.mbNo="";
          this.odrNm="";
        },
        cancelOmOd(dtl){
          dtl.odTypCd = "20";
          dtl.procSeq = null;
          self = this;
          axios({
            method:'post',
            url:'http://127.0.0.1:8080/api/cancelOmOd',
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            },
            data:dtl,
          }).then(function (response) {
            if(response.status == 200){
              alert("주문 취소 되었습니다.");
              self.setList();
            }
          });
        },
        insert(){
          var i=1;
          for(var a of self.omOdDtlList){
            a.odSeq = i;
            i++;
            for(var b of self.omOdFvrDtlList)
            {
              if(a.prNo == b.prNo){
                b.odSeq = a.odSeq;
              }
            }
          }
          self = this;
          axios({
            method:'post',
            url:'http://127.0.0.1:8080/api/omOdInsert',
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            },
            data:{
              omOdDtlList: self.omOdDtlList,
              omOdFvrDtlList: self.omOdFvrDtlList,
            }
          }).then(function (response) {
            if(response.status == 200){
              alert("저장되었습니다.");
              self.setList();
            }
          });
        },
        odPrgsStepCdList(){
          self = this;
          axios({
            method:'post',
            url:'http://127.0.0.1:8080/api/odPrgsStepCdList',
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            },
            data:{
              odNo: self.odNo,
              mbNo: self.mbNo,
              odrNm: self.odrNm,
              odPrgsStepCd: "02",
            }
          }).then(function (response) {
            if(response.status == 200){
              self.omOdList = response.data;
            }
          });
        },
        cancelList(){
          self = this;
          axios({
            method:'post',
            url:'http://127.0.0.1:8080/api/omOdCancelList',
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true"
            },
            data:{
              odNo: self.odNo,
              mbNo: self.mbNo,
              odrNm: self.odrNm,
              odTypCd: "20",
            }
          }).then(function (response) {
            if(response.status == 200){
              self.omOdList = response.data;
            }
          });
        },
        setList(){
            self = this;
            axios({
                method:'post',
                url:'http://127.0.0.1:8080/api/omOdList',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
              data:{
                odNo: self.odNo,
                mbNo: self.mbNo,
                odrNm: self.odrNm,
              }
            }).then(function (response) {
                if(response.status == 200){
                    self.omOdList = response.data;
                    console.log(response.data);
                }
            });
        },
        dateFormat(date){
            if(date){
                return moment(date).format("YYYY-MM-DD");
            }else{
                return null;
            }
        }
    },
}
</script>
