<script setup>
import { ref, reactive } from 'vue';
import { useAuth } from "@/stores"
import { useRouter } from 'vue-router';


const auth = useAuth();
const router = useRouter();

const form = reactive({
    pinfl: "",
});

const onFinish = async (values) => {
    const isSuccess = await auth.login(values);
    if (isSuccess) router.push({ path: "/" });
    else AMessage.error("Login yoki parol noto'g'ri");
}


const onFinishFailed = (errorInfo) => {

};


</script>

<template>
    <div class="container">
        <div class="login">
            <h1 class="login-title">
                Bojxona Hamkor
            </h1>
            <AForm :model="form" layout="vertical" @finish="onFinish" @finishFailed="onFinishFailed">
                <AFormItem label="ПИНФЛ" name="pinfl" class="login-text" style="margin-bottom: 12px;"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <AInput v-model:value="form.pinfl" />
                </AFormItem>
                <Button class="login-btn">КИРИШ</Button>
            </AForm>
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

        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 30px;
        margin-bottom: 4px;
    }

    &-btn {
        width: 100%;
    }

}
</style>