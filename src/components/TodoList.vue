<template>
    <div class="container">
        <h2>Todo List</h2>
        <div class="input-group" style="margin-bottom:10px;">
            <input type="text" v-model="contents" class="form-control" v-on:keyup.enter="insert()"  placeholder="할일 입력">
            <span class="input-group-btn">
                <button class="btn btn-default" type="button" @click="insert()">추가</button>
            </span>
        </div>
        <hr>
        <div>
            <table style="width:100%">
              <div  v-for="(todo,i) in todoList" :key=i>
                <tr>
                    <td style="width:5%">
                        <input type="checkbox" id="checkbox"  v-model="todo.completeYn" @click="todoUpdate(todo,'YN')">
                    </td>
                    <td style="width:8%">
                        {{i+1}}
                    </td>
                    <td style="width:60%">
                        <input type="text" :disabled="todo.completeYn" class="form-control" v-on:keyup.enter="todoUpdate(todo)" style="border:none;" v-model="todo.contents" ref="input">
                    </td>
                    <td>
                        <button class="btn btn-default" :disabled="todo.completeYn" type="button" @click="todoUpdate(todo)">수정</button>
                    </td>
                    <td>
                        <button class="btn btn-default" type="button" @click="todoDelete(todo.index)">삭제</button>
                    </td>
                    <td style="width:10%">
                    {{dateFormat(todo.creationDate)}}

                    </td>
                    <td style="width:10%">
                    {{dateFormat(todo.modifiedDate)}}
                    </td>
                </tr>
                <div v-for="(comm,j) in todo.commentList" :key=j>
                <tr>
                  <td style="width:5%">

                  </td>
                  <td style="width:8%">
                    {{ i+1 }}-{{ j+1 }}.
                  </td>
                  <td style="width:60%">
                    <input type="text" class="form-control" v-on:keyup.enter="todoUpdate(comm)" style="border:none;" v-model="comm.contents" ref="input">
                  </td>
                  <td>
                    <button class="btn btn-default" type="button" @click="todoUpdate(comm)">수정</button>
                  </td>
                  <td>
                    <button class="btn btn-default" type="button" @click="todoDelete(comm.commentIndex)">삭제</button>
                  </td>
                  <td style="width:10%">
                    {{dateFormat(comm.creationDate)}}

                  </td>
                  <td style="width:10%">
                    {{dateFormat(comm.modifiedDate)}}
                  </td>
                </tr>
                <tr v-for="(recomm,r) in comm.reCommentList" :key=r>
                  <td style="width:5%">
                  </td>
                  <td style="width:8%">
                    <p style="text-indent: 20px">{{ i+1 }}-{{ j+1 }}-{{ r+1 }}</p>
                  </td>
                  <td style="width:60%">
                    <input type="text" class="form-control" v-on:keyup.enter="todoUpdate(recomm)" style="border:none;" v-model="recomm.contents" ref="input">
                  </td>
                  <td>

                  </td>
                  <td>
                    <button class="btn btn-default" type="button" @click="todoDelete(recomm.commentIndex)">삭제</button>
                  </td>
                  <td style="width:10%">
                    {{dateFormat(recomm.creationDate)}}

                  </td>
                  <td style="width:10%">
                    {{dateFormat(recomm.modifiedDate)}}
                  </td>
                </tr>
                </div>
              </div>
            </table>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
    name:'TodoList',
    data(){
        return{
            msg:"TodoList",
            contents:"",
            todoList:{},
        }
    },
    mounted(){
        this.setList();
    },
    methods:{
        insert(){
            self = this;
            axios({
                method:'post',
                url:'http://127.0.0.1:8080/api/insert',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
                params:{
                    contents:this.contents,
                },
                data:{
                    contents:this.contents,
                }
            }).then(function (response) {
                if(response.status == 200){
                    self.contents = "";
                    self.setList();
                }
            });
        },
        todoDelete(index){
            self = this;
            axios({
                method:'post',
                url:'http://127.0.0.1:8080/api/delete',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
                params:{
                    index:index,
                }
            }).then(function (response) {
                if(response.status == 200){
                    self.setList();
                }
            });
        },
        todoUpdate(todo,yn){
            if(yn == "YN"){
                todo.completeYn = !todo.completeYn;
            }
            self = this;
            axios({
                method:'post',
                url:'http://127.0.0.1:8080/api/update',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
                data:todo
            }).then(function (response) {
                if(response.status == 200){
                    self.setList();
                }
            });
        },
         completYN(completeYn){
            if(completeYn == "N"){
              return false;
            }
            return true;
        },
        setList(){
               self = this;
            axios({
                method:'get',
                url:'http://127.0.0.1:8080/api/todoList',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": "true"
                },
                params:{
                }
            }).then(function (response) {
                if(response.status == 200){
                    self.todoList = response.data;
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
