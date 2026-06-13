import { CubeProvider } from '../../components/CubeTransition'
import Step1Delivery from './Step1Delivery'
import Step2Calendar from './Step2Calendar'
import Step3Summary from './Step3Summary'

const STEPS = [Step2Calendar, Step1Delivery, Step3Summary]

export default function TunnelWrapper() {
  return <CubeProvider steps={STEPS} />
}
