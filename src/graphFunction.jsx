

class Vertex {
    constructor(id, data) {
    this.id = id;
    this.data = data;
    this.prev = []; // 이전 노드 리스트
    this.next = []; // 다음 노드 리스트
    }
  }
  
  // 분기, 삭제 가능 유무 데이터 추가해야함
  
  export default class DirectedGraph {
    constructor(id) {
      this.id=id;
      this.vertices = {}; // 정점들을 저장하는 객체, { id: Vertex객체 }
      this.first=this.add_vertex(0, {text:'first', x:0, y:0}); //첫번째 노드
    }
  
    add_vertex(id, data) {  //정점 추가
      const new_vertex = new Vertex(id, data);
      if (!(id in this.vertices)) {
        this.vertices[id] = new_vertex;
      }
      return new_vertex;  //반환도 해중
    }
  
    add_edge(from_vertex_id, to_vertex_id) {  //간선 추가
      if (from_vertex_id in this.vertices && to_vertex_id in this.vertices) {
        const from_vertex = this.vertices[from_vertex_id];
        const to_vertex = this.vertices[to_vertex_id];
        to_vertex.prev.push(from_vertex);
        from_vertex.next.push(to_vertex);
      }
    }
  
    append_next(vertex_id) {
      const next = this.next_vertexs(vertex_id); // vertex_id 정점 다음의 모든 정점 ID 배열
      const newId = Math.max(...Object.keys(this.vertices)) + 1;
      this.add_vertex(newId, {text:'Append ' + newId, x:0, y:0});
      this.add_edge(vertex_id, newId); // 현재-새 정점
      for (const i of next) {
        this.add_edge(newId, i); // 새 정점-next
        this.delete_edge(vertex_id, i); // vertex_id-next 간선 제거
      }
    }
  
    branch(vertex_id) {
      const prev = this.prev_vertexs(vertex_id); // 연결된 ID가 vertex_id인 모든 정점 ID 배열
      const next = this.next_vertexs(vertex_id); // vertex_id 정점 다음의 모든 정점 ID 배열
      if (prev.length === 1 && next.length === 1) { //0-0-0의 경우만 분기 가능
        const newId = Math.max(...Object.keys(this.vertices)) + 1;
        const nextid=(prev.length===1&&this.vertices[prev[0]].next.length===1&&this.vertices[next[0]].prev.length===1) ? next[0] : this.next_branch(this.vertices[prev[0]]).id;
        this.add_vertex(newId, {text:'Append ' + newId, x:0, y:0});
        this.add_edge(prev[0], newId); // 전 정점-새 정점
        //앞뒤 위상의 간선 개수 1개며 이전 정점이 1개일때
        this.add_edge(newId, nextid); // 새 정점-분기 끝나는 정점
      } else {
        console.log('분기 안되죠');
      }
    }
  
    delete_vertex(vertex_id) {  //정점 삭제
      if (vertex_id in this.vertices) {
        const vertex = this.vertices[vertex_id];
        for (const prev_vertex of vertex.prev) {
          prev_vertex.next = prev_vertex.next.filter(next_vertex => next_vertex !== vertex);
        }
        for (const next_vertex of vertex.next) {
          next_vertex.prev = next_vertex.prev.filter(prev_vertex => prev_vertex !== vertex);
        }
        delete this.vertices[vertex_id];
      }
    }
  
    delete_edge(from_vertex_id, to_vertex_id) { //간선 삭제
      if (from_vertex_id in this.vertices && to_vertex_id in this.vertices) {
        const from_vertex = this.vertices[from_vertex_id];
        const to_vertex = this.vertices[to_vertex_id];
        from_vertex.next = from_vertex.next.filter(next_vertex => next_vertex !== to_vertex);
        to_vertex.prev = to_vertex.prev.filter(prev_vertex => prev_vertex !== from_vertex);
      }
    }
  
    prev_vertexs(vertex_id) { //연결된 ID가 vertex_id인 모든 정점 ID 배열
      const vertex = this.vertices[vertex_id];
      if (vertex) {
        return vertex.prev.map(child => child.id);
      }
    }
  
    next_vertexs(vertex_id) { //vertex_id 정점 다음의 모든 정점 ID 배열
      if (Array.isArray(vertex_id)) { //id가 배열로 넘어오면 첫 데이터로
        return this.next_vertexs(vertex_id[0]);
      }
      const vertex = this.vertices[vertex_id];
      if (vertex) {
        return vertex.next.map(child => child.id);
      }
    }
  
    execute(prev, next, vertex_id) {  //정점 제거 실행, 경우가 많아서 함수로 뺌
      for (const i of prev) {
        this.delete_edge(i, vertex_id);
      }
      for (const i of next) {
        this.delete_edge(vertex_id, i); // vertex_id와 관련된 모든 간선 제거
      }
      this.delete_vertex(vertex_id); // vertex_id 제거
    }
  
    remove_vertex(vertex_id) {
      const prev = this.prev_vertexs(vertex_id); // 연결된 ID가 vertex_id인 모든 정점 ID 배열
      const next = this.next_vertexs(vertex_id); // vertex_id 정점 다음의 모든 정점 ID 배열
      if (!prev.length || prev.length > 1) {  //이전 노드가 없거나 2개 이상일때
        if (!next.length || next.length > 1) {  //다음 노드도 그러면 삭제 불가
          console.log('삭제 불가');
          return;
        }
        for (const i of prev) { //이전노드 순회, next가 1개인 경우
          console.log('찾았따', i, next[0]);
          this.add_edge(i, next[0]); // 삭제될 정점 앞뒤 잇기
          this.execute(prev, next, vertex_id);
        }
        return;
      }
      let vlist = this.next_vertexs(prev);
      vlist = vlist.filter(v => v !== vertex_id);
      if (vlist.length) { //이전 노드의 모든 next 리스트
        for (const i of vlist) {
          let nextl = this.next_vertexs(i);
          while (nextl) {
            for (const j of next) {
              if (nextl[0] === j) {
                console.log('찾았따', prev[0], i);
                this.execute(prev, next, vertex_id);
                break;
              }
            }
            nextl = this.next_vertexs(nextl);
          }
        }
      } else {
        for (const i of next) {
          this.add_edge(prev[0], i); // 삭제될 정점 앞뒤 잇기
        }
        this.execute(prev, next, vertex_id); // 정점 삭제
      }
    }
  
    print_graph() {
      for (const vertex of Object.values(this.vertices)) {
        const prev_ids = vertex.prev.map(prev => prev.id);
        const next_ids = vertex.next.map(next => next.id);
        console.log(`Vertex ID: ${vertex.id}, Data: ${vertex.data}, Prev: ${prev_ids}, Next: ${next_ids}`);
      }
      
      console.log("TEST: ",this.print_route(this.first), this.next_branch(this.first));
      console.log();
    }
  
    print_route(vertex){  //컴포넌트 재귀호출로 프린팅
      let text='';  //이악물고 재귀인 이유: 트리 성격이라
      if (vertex.next.length){
        if (vertex.next.length>1){  //묶기 시작
          text+='->(';  
          for (const i of vertex.next){
            text+=this.print_route(i)+',';
          }
          text=text.slice(0,-1)+")";  //묶기 끝
        }
        for (const i of vertex.next){ //묶을 때 실행
          if (vertex.next.length===i.prev.length) 
            text+='->'+this.print_route(i);
        }
        if (vertex.next.length>1){ //현재 정점 next 리스트 여러개면
          text+='->'+this.print_route(this.next_branch(vertex)); //가장 최근 정점의 다음으로
        }
        return vertex.id+text;
      } //next 없으면 리턴
      else{
        return text+vertex.id;
      }
    }
  
    next_branch(vertex){  //분기시 분기 다음정점 리턴, 분기 없는경우 맨 마지막 정점 리턴
      if (vertex.next.length){
        const stop=vertex.next.length;
        let tmp=vertex.next[0];
        while(tmp.prev.length!==stop){
          tmp=tmp.next[0];
        }
        return (tmp.next) ? tmp : vertex;
      }
      return vertex;
    }
  }