import React, { Component } from 'react'
import cN from 'classnames'
import showdown from 'showdown'

const converter = new showdown.Converter()
import s from './Popup.css'

import like from './icons/like.svg'
import unlike from './icons/unlike.svg'

export default class Popup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.$el.classList.add(s.mounted)
    }, 30)

    window.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.handleKeyPress)
  }

  shouldComponentUpdate (newProps, newState) {
    if (this.state.open !== newState.open) return true
    return false
  }

  handleKeyPress = ({ key }) => {
    if (key === 'Escape') this.handleClose()
  }

  handleClose = () => {
    this.$el.classList.remove(s.mounted)
    setTimeout(() => {
      this.props.close()
    }, 430)
  }

  render () {
    const { open } = this.state
    const { name, camara, partido, foto, votosMasRecientes, enQueEleccionSacoLosVotosMasRecientes, perfilito, departamento, posicionIz_der1A100, banderas, comoVota, numeroEnElTarjeton } = this.props
    return (
      <div ref={el => this.$el = el} className={s.root}>
        <div className={s.overlay} onClick={this.handleClose} />
        <div className={cN(s.inner, s.borderTop)}>
          <div className={s.intro}>
            <div className={s.photo} style={{ backgroundImage: `url(${foto})` }} />
            <div className={s.name}>
              {(camara === 'Senado') ?
                <span className={s.smallTextCaps}>Aspirante al {camara}</span>
                :
                <span className={s.smallTextCaps}>Aspirante a la {camara}</span>
              }
              <h4>{name}</h4>
              <div className={s.departamento}>
                {partido.toUpperCase()}, {departamento}

                <button className={s.noBtn} onClick={(e) => {
                  this.setState({ open: !open })
                }}>
                  LEER BIOGRAFÍA >
                </button>
              </div>
            </div>
            {numeroEnElTarjeton ?
              <div className={s.number}>
                <span>{numeroEnElTarjeton}</span>
                <div>EN EL TARJÉTON</div>
              </div>
              : undefined}
          </div>


          {open ?
            <article className={s.content}
                     dangerouslySetInnerHTML={{ __html: converter.makeHtml(perfilito || '*No biografía*') }} />
            : undefined}

          <div className={s.section}>
            <h4>Espectro ideológico</h4>
            <div className={s.espectro}>
              {[0, 20, 40, 60, 80].map((item, index) => {
                return (
                  <div
                    key={item}
                    className={cN(s.espectro__section, {
                        [s.espectro__sectionActive]: posicionIz_der1A100 >= item && posicionIz_der1A100 < item + 20
                      }
                    )}
                  />
                )
              })}
            </div>
            <div className={s.espectro__line}><span /><span /><span /></div>
            <footer className={cN(s.espectro__footer, s.espectro__header)}>
              <span>IZQUIERDA</span>
              <span>CENTRO</span>
              <span>DERECHA</span>
            </footer>
          </div>

          <div className={s.section}>
            <h4>Como votó en</h4>
            <table className={s.listRows}>
              <thead>
              <tr>
                <th />
                <th>Pro</th>
                <th>Contra</th>
              </tr>
              </thead>
              <tbody>
              {comoVota.map((pos, i) => {
                return (
                  <tr key={i}>
                    <td width={500} height={50}>{pos.title}</td>
                    {(pos.value !== 'Sí' && pos.value !== 'No') ?
                      <td colSpan={2}><span className={s.error}>{pos.value}</span></td>
                      : <React.Fragment>
                        <td className={cN(s.like, { [s.chosen]: pos.value === 'Sí' })}
                            dangerouslySetInnerHTML={{ __html: like }} />
                        <td className={cN(s.unlike, { [s.chosen]: pos.value === 'No' })}
                            dangerouslySetInnerHTML={{ __html: unlike }} />
                      </React.Fragment>
                    }
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>

          <div className={s.section}>
            <h4>Proyectos bandera</h4>
            {!banderas.filter((item) => {
              if (item) return true
            }).length ? <div dangerouslySetInnerHTML={{ __html: '<em>No tiene banderas claras</em>' }} /> :
              (<ul className={cN(s.list, s.list__blocks)}>
                {banderas.map((bandera) => {
                    if (bandera)
                      return <li key={bandera}>{bandera}</li>
                  }
                )}
              </ul>)
            }
          </div>

          <footer className={s.section}>
            <h4>Última Votación</h4>
            {enQueEleccionSacoLosVotosMasRecientes && (enQueEleccionSacoLosVotosMasRecientes !== 'No aplica') ?
              <div className={s.espectro__footer}>
                <div className={s.espectro__footer__item}>
                  {enQueEleccionSacoLosVotosMasRecientes}<br />
                  <span>AÑO</span>
                </div>
                <div className={s.espectro__footer__item}>
                  {votosMasRecientes || 'Sin definir'}<br />
                  <span>VOTOS</span>
                </div>
              </div>
              : <em>Sin previo votación</em>}
          </footer>

          <button className={s.buttonClose} onClick={this.handleClose}>
            <svg viewBox="0 0 40 40">
              <path className={s.closeX} d="M 10,10 L 30,30 M 30,10 L 10,30" />
            </svg>
          </button>
        </div>
      </div>
    )
  }
}