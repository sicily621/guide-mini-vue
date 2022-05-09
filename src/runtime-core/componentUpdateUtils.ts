export function shouldUpdateComponent(prevVnode,nextVnode){
    const { props: prevProps } = prevVnode;
    const { props: nextProps } = nextVnode;

    for (const key in nextProps) {
      if (nextProps[key] !== prevProps[key]) {
        return true;
      }
    }
    return false;
}