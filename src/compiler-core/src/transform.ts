export function transform(root,options = {}){
    //深度优先遍历
    const context = createTransformContext(root, options);
    traverseNode(root, context);
    createRootCodegen(root);
}
function createRootCodegen(root){
    root.codegenNode = root.children[0];
}
function createTransformContext(root, options) {
    const context = {
      root,
      nodeTransforms: options.nodeTransforms||[]
    };
    return context;
}
function traverseNode(node:any,context){
    const nodeTransforms = context.nodeTransforms;
    for(let i = 0;i<nodeTransforms.length;i++){
        const transform = nodeTransforms[i];
        transform(node);
    }
    const children = node.children;
    if(children){
        for(let i = 0;i<children.length;i++){
            const node = children[i];
            traverseNode(node,context);
        }
    }
}