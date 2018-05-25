import encrypt from '@libs/encrypt'

const id = parseInt(process.argv[2])
if (id) {
    console.log(
        encrypt.encode({
            id,
        })
    )
} else {
    console.error('id错误')
}
