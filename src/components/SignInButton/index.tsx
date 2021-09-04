import {FaGithub} from 'react-icons/fa'
import {FiX} from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/client'

import styled from './styles.module.scss'

export function SignInButton() {
    const [session] = useSession()
    
    return session ? (
        <button
            className={styled.signInButton}
            onClick={() => signOut()}
        >
            <FaGithub color="#04d361" />
            Sander Paniago
            <FiX color="#737380" className={styled.closeIcon} />
        </button>
    ) : (
        <button
            className={styled.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub color="#eba417" />
            Sign in with Github
        </button>
    )
}