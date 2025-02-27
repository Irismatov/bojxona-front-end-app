<script setup>
import { Form, FormItem, Input } from 'ant-design-vue';
import { ref, reactive } from 'vue';



const form = reactive({
    login: "",
    password: "",
});

const onFinish = async (values) => {
    console.log(values);
}


const onFinishFailed = (errorInfo) => {
    console.log('am I working ?')
};


</script>

<template>
    <div class="container">
        <div class="login">
            <h1 class="login-title">
                Bojxona Hamkor
            </h1>
            <Form :model="form" layout="vertical" @finish="onFinish" @finishFailed="onFinishFailed">
                <FormItem label="Login" name="login" class="login-text"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <Input v-model:value="form.login" />
                </FormItem>
                <FormItem label="Parol" name="password" class="login-text"
                    :rules="[{ required: true, message: 'Please input your password!' }]">
                    <Input v-model:value="form.password" />
                </FormItem>
                <Button class="login-btn">KIRISH</Button>
            </Form>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login {
    border-radius: 6px;
    background: #FFF;
    box-shadow: 0px 4px 18px 0px rgba(75, 70, 92, 0.10);
    padding: 32px;
    max-width: 450px;
    width: 100%;
    margin: auto auto;

    &-title {
        color: #4B465C;
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "Public Sans";
        font-size: 26px;
        font-style: normal;
        font-weight: 700;
        line-height: 36px;
        text-align: center;
        margin-bottom: 24px;
    }

    &-text {
        color: #4B465C;
        font-feature-settings: 'liga' off, 'clig' off;
        font-family: "Public Sans";
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 30px;
        margin-bottom: 4px;

        &:last-child {
            margin-bottom: 10px;
        }
    }

    &-btn {
        width: 100%;
    }

}
</style>